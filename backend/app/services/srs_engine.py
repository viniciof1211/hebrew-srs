from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime, timedelta
import uuid
from ..models import db, flashcards
import httpx

router = APIRouter()

# Pydantic schemas
class FlashCardIn(BaseModel):
    hebrew_word: str
    translation: str
    context_sentence: str | None = None
    svg_data: str | None = None
    image_url: str | None = None

class FlashCardOut(FlashCardIn):
    id: str
    next_review: datetime
    interval_days: int
    ease_factor: float
    repetitions: int

# SRS Endpoints
@router.post('/create', response_model=FlashCardOut)
async def create_card(data: FlashCardIn):
    card_id = str(uuid.uuid4())
    now = datetime.utcnow()
    query = flashcards.insert().values(
        id=card_id,
        hebrew_word=data.hebrew_word,
        translation=data.translation,
        context_sentence=data.context_sentence,
        svg_data=data.svg_data,
        image_url=data.image_url,
        next_review=now,
        interval_days=1,
        ease_factor=2.5,
        repetitions=0,
    )
    await db.execute(query)
    record = await db.fetch_one(flashcards.select().where(flashcards.c.id == card_id))
    return record

@router.get('/next', response_model=list[FlashCardOut])
async def get_due_cards(limit: int = Query(20, gt=0)):  # fetch due cards
    now = datetime.utcnow()
    query = flashcards.select().where(flashcards.c.next_review <= now).limit(limit)
    results = await db.fetch_all(query)
    return results

@router.post('/update')
async def update_card(card_id: str, correct: bool):
    rec = await db.fetch_one(flashcards.select().where(flashcards.c.id == card_id))
    if not rec:
        raise HTTPException(404, 'Card not found')
    ease, interval, reps = rec['ease_factor'], rec['interval_days'], rec['repetitions']
    if correct:
        reps += 1
        ease = max(1.3, ease + 0.1)
        interval = int(interval * ease)
    else:
        reps = 0
        ease = max(1.3, ease - 0.2)
        interval = 1
    next_rev = datetime.utcnow() + timedelta(days=interval)
    await db.execute(
        flashcards.update().where(flashcards.c.id == card_id).values(
            ease_factor=ease,
            interval_days=interval,
            repetitions=reps,
            next_review=next_rev
        )
    )
    return {'next_review': next_rev}

# Dictionary lookup & multimedia stub
@router.get('/lookup')
async def lookup_word(word: str):
    # Example: call external Hebrew-English API
    async with httpx.AsyncClient() as client:
        # placeholder URL
        resp = await client.get(f'https://api.dictionary.example/lookup?word={word}')
        data = resp.json()
    return data  # return definitions, examples, audio URLs, SVGs