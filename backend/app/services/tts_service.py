from fastapi import APIRouter, HTTPException
from gtts import gTTS
from fastapi.responses import FileResponse
from tempfile import NamedTemporaryFile

router = APIRouter()

@router.get('/tts')
async def text_to_speech(word: str, lang: str = 'he'):
    """
    Generate TTS audio for the given Hebrew word (or other languages).
    Returns an MP3 file response.
    """
    if not word:
        raise HTTPException(status_code=400, detail='Word parameter is required')
    try:
        tts = gTTS(text=word, lang=lang)
        tmp = NamedTemporaryFile(delete=False, suffix='.mp3')
        tts.write_to_fp(tmp)
        tmp.flush()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'TTS generation failed: {e}')

    return FileResponse(tmp.name, media_type='audio/mpeg', filename=f'{word}.mp3')
