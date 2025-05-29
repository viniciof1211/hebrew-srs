from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import init_db
from .services.srs_engine import router as srs_router
from .services import tts_service
from .services import auth
# from .services.practice_engine import consume_new_cards

import threading

app = FastAPI(title='Hebrew Vocab Trainer API')
app.include_router(tts_service.router, prefix='/audio', tags=['tts'])
app.include_router(auth.router, prefix='/auth')

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

# Initialize DB
@app.on_event('startup')
async def startup():
    await init_db()

# Initialize Consume New Flashcards Cycle
# @app.on_event('startup')
# def start_practice_consumer():
#    thread = threading.Thread(target=consume_new_cards, daemon=True)
#    thread.start()

# Include SRS routes
app.include_router(srs_router, prefix='/cards', tags=['cards'])

@app.get('/')
def root():
    return {'message': 'Hebrew Vocab Trainer API is running'}


