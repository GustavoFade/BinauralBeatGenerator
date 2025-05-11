import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';

const presets: Record<string, { freq: number; description: string }> = {
  Alfa: { freq: 10, description: 'Relaxamento e meditação (8–12 Hz)' },
  Teta: { freq: 6, description: 'Criatividade e relaxamento profundo (4–7 Hz)' },
  Delta: { freq: 2, description: 'Sono profundo e regeneração (0,5–4 Hz)' },
  Beta: { freq: 20, description: 'Foco, atenção e desempenho cognitivo (13–30 Hz)' },
  Gamma: { freq: 40, description: 'Processamento cognitivo avançado e alerta (30–100 Hz)' },
};

const STORAGE = {
  baseFreq: 'binaural_baseFreq',
  preset: 'binaural_preset',
  customFreq: 'binaural_customFreq',
  volume: 'binaural_volume'
};

const BinauralBeatGenerator: React.FC = () => {
  const [baseFreq, setBaseFreq] = useState<number>(() => {
    const v = localStorage.getItem(STORAGE.baseFreq);
    return v ? Number(v) : 400;
  });
  const [preset, setPreset] = useState<string>(() => localStorage.getItem(STORAGE.preset) || '');
  const [customFreq, setCustomFreq] = useState<number | ''>(() => {
    const v = localStorage.getItem(STORAGE.customFreq);
    return v !== null ? Number(v) : '';
  });
  const [volume, setVolume] = useState<number>(() => {
    const v = localStorage.getItem(STORAGE.volume);
    return v ? Number(v) : 0.1;
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscLRef = useRef<OscillatorNode | null>(null);
  const oscRRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const getBeatFreq = () => {
    if (customFreq !== '') return customFreq;
    if (preset) return presets[preset].freq;
    return 0;
  };

  const startTone = () => {
    if (isPlaying) return;
    const beat = getBeatFreq();
    if (!beat) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscL = audioCtx.createOscillator();
    const oscR = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscL.type = 'sine';
    oscR.type = 'sine';
    oscL.frequency.value = baseFreq - beat / 2;
    oscR.frequency.value = baseFreq + beat / 2;

    gain.gain.value = volume;

    const merger = audioCtx.createChannelMerger(2);
    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(gain).connect(audioCtx.destination);

    oscL.start();
    oscR.start();

    audioCtxRef.current = audioCtx;
    oscLRef.current = oscL;
    oscRRef.current = oscR;
    gainRef.current = gain;
    setIsPlaying(true);
  };

  const stopTone = () => {
    oscLRef.current?.stop();
    oscRRef.current?.stop();
    audioCtxRef.current?.close();

    audioCtxRef.current = null;
    oscLRef.current = null;
    oscRRef.current = null;
    gainRef.current = null;
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && oscLRef.current && oscRRef.current && audioCtxRef.current) {
      const beat = getBeatFreq();
      oscLRef.current.frequency.setValueAtTime(
        baseFreq - beat / 2,
        audioCtxRef.current.currentTime
      );
      oscRRef.current.frequency.setValueAtTime(
        baseFreq + beat / 2,
        audioCtxRef.current.currentTime
      );
    }
  }, [baseFreq, preset, customFreq]);

  useEffect(() => {
    if (isPlaying && gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(STORAGE.baseFreq, baseFreq.toString());
  }, [baseFreq]);

  useEffect(() => {
    localStorage.setItem(STORAGE.preset, preset);
  }, [preset]);

  useEffect(() => {
    if (customFreq === '') localStorage.removeItem(STORAGE.customFreq);
    else localStorage.setItem(STORAGE.customFreq, customFreq.toString());
  }, [customFreq]);

  useEffect(() => {
    localStorage.setItem(STORAGE.volume, volume.toString());
  }, [volume]);

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Gerador de Ondas Binaurais
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography gutterBottom>
              Tom base (carrier) [50–600 Hz]: {baseFreq} Hz
            </Typography>
            <Slider
              value={baseFreq}
              onChange={(_, val) => setBaseFreq(val as number)}
              min={50}
              max={600}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="preset-label">Preset de Batimento</InputLabel>
            <Select
              labelId="preset-label"
              value={preset}
              label="Preset de Batimento"
              onChange={(e) => {
                setPreset(e.target.value as string);
                setCustomFreq('');
              }}
            >
              {Object.entries(presets).map(([label, { freq }]) => (
                <MenuItem key={label} value={label}>
                  {`${label} (${freq} Hz)`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {preset && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {presets[preset].description}
            </Typography>
          )}

          <TextField
            fullWidth
            type="number"
            label="Frequência Customizada (Hz)"
            variant="outlined"
            value={customFreq}
            onChange={(e) => {
              const v = e.target.value;
              setCustomFreq(v === '' ? '' : Number(v));
              if (v !== '') setPreset('');
            }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 4 }}>
            <Typography gutterBottom>Volume: {(volume * 100).toFixed(0)}%</Typography>
            <Slider
              value={volume}
              onChange={(_, val) => setVolume(val as number)}
              min={0}
              max={1}
              step={0.01}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={startTone}
              disabled={isPlaying}
            >
              Iniciar
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={stopTone}
              disabled={!isPlaying}
            >
              Parar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BinauralBeatGenerator;
