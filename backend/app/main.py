from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import init_db
from .services.srs_engine import router as srs_router

app = FastAPI(title='Hebrew Vocab Trainer API')

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

# Include SRS routes
app.include_router(srs_router, prefix='/cards', tags=['cards'])

@app.get('/')
def root():
    return {'message': 'Hebrew Vocab Trainer API is running'}