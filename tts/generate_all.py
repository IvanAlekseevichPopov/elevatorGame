#!/usr/bin/env python3
"""
Генерация всех 100 слогов с Silero TTS
- aidar slow → /output/aidar
- eugene x-slow → /output/eugene
"""

import torch
import os
import scipy.io.wavfile as wavfile
import numpy as np

# Согласные и гласные из игры
CONSONANTS = ['М', 'Н', 'П', 'Б', 'К', 'Т', 'Д', 'С', 'Л', 'Р']
VOWELS = ['А', 'О', 'У', 'И', 'Е', 'Ы', 'Ю', 'Э', 'Я', 'Ё']

# Транслитерация для имён файлов
TRANSLIT = {
    'М': 'm', 'Н': 'n', 'П': 'p', 'Б': 'b', 'К': 'k',
    'Т': 't', 'Д': 'd', 'С': 's', 'Л': 'l', 'Р': 'r',
    'А': 'a', 'О': 'o', 'У': 'u', 'И': 'i', 'Е': 'e',
    'Ы': 'y', 'Ю': 'yu', 'Э': 'eh', 'Я': 'ya', 'Ё': 'yo'
}

# Конфигурации голосов
CONFIGS = [
    {'speaker': 'aidar', 'rate': 'slow', 'output_dir': '/output/aidar'},
    {'speaker': 'eugene', 'rate': 'x-slow', 'output_dir': '/output/eugene'},
]


def make_ssml(text, rate):
    return f'<speak><prosody rate="{rate}">{text}</prosody></speak>'


def main():
    device = torch.device('cpu')
    torch.set_num_threads(4)

    model, _ = torch.hub.load(
        repo_or_dir='snakers4/silero-models',
        model='silero_tts',
        language='ru',
        speaker='v4_ru',
        trust_repo=True
    )
    model.to(device)

    sample_rate = 48000

    for config in CONFIGS:
        speaker = config['speaker']
        rate = config['rate']
        output_dir = config['output_dir']

        os.makedirs(output_dir, exist_ok=True)
        print(f"\n{'='*50}")
        print(f"Голос: {speaker}, скорость: {rate}")
        print(f"Папка: {output_dir}")
        print('='*50)

        count = 0
        for consonant in CONSONANTS:
            for vowel in VOWELS:
                syllable = consonant + vowel
                filename = f"{TRANSLIT[consonant]}{TRANSLIT[vowel]}.wav"
                filepath = os.path.join(output_dir, filename)

                ssml = make_ssml(syllable, rate)

                audio = model.apply_tts(
                    ssml_text=ssml,
                    speaker=speaker,
                    sample_rate=sample_rate
                )

                audio_np = audio.numpy()
                audio_int16 = (audio_np * 32767).astype(np.int16)
                wavfile.write(filepath, sample_rate, audio_int16)

                count += 1
                print(f"  ✓ {syllable} → {filename}")

        print(f"\n✅ {speaker}: сгенерировано {count} файлов")

    print(f"\n{'='*50}")
    print("Готово!")
    print('='*50)


if __name__ == "__main__":
    main()
