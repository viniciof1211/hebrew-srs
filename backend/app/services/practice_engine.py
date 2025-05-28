from kafka import KafkaConsumer
import json
from langchain import OpenAI, LLMChain, PromptTemplate
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langgraph import GraphBuilder
from pymongo import MongoClient
from datetime import datetime

# Mongo setup
db_client = MongoClient('mongodb://mongodb:27017/')
practice_db = db_client['practice_db']
sentences_col = practice_db['practice_sentences']
attempts_col = practice_db['practice_attempts']

# Kafka Consumer for CDC topic
def consume_new_cards():
    consumer = KafkaConsumer(
        'vocab_trainer.flashcards',
        bootstrap_servers='kafka:9092',
        auto_offset_reset='earliest',
        value_deserializer=lambda m: json.loads(m)
    )
    embeddings = OpenAIEmbeddings()
    vector_store = FAISS(embeddings.embed_query, "faiss_index")
    llm = OpenAI(temperature=0.7)
    prompt = PromptTemplate(
        input_variables=['word'],
        template='Generate a coherent Hebrew sentence using the word: {word}.'
    )
    chain = LLMChain(llm=llm, prompt=prompt)

    for msg in consumer:
        record = msg.value['after'] or msg.value['before']
        word = record['hebrew_word']
        # Generate sentence
        sentence = chain.run(word=word)
        # Index embedding
        vector_store.add_texts([sentence], ids=[str(record['id'])])
        # Build graph metadata
        graph = GraphBuilder()
        graph.add_node({'id': str(record['id']), 'sentence': sentence})
        # Store in MongoDB
        sentences_col.insert_one({
            'card_id': record['id'],
            'sentence': sentence,
            'created_at': datetime.utcnow(),
            'leitner_box': 0
        })