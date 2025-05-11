import React, { useState, useRef } from 'react';
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
  Alfa: {
    freq: 10,
    description: 'Relaxamento e meditação (8–12 Hz)',
  },
  Teta: {
    freq: 6,
    description: 'Criatividade e relaxamento profundo (4–7 Hz)',
  },
  Delta: {
    freq: 2,
    description: 'Sono profundo e regeneração (0,5–4 Hz)',
  },
  Beta: {
    freq: 20,
    description: 'Foco, atenção e desempenho cognitivo (13–30 Hz)',
  },
  Gamma: {
    freq: 40,
    description: 'Processamento cognitivo avançado e alerta (30–100 Hz)',
  },
};

const BinauralBeatGenerator: React.FC = () => {
  const [baseFreq, setBaseFreq] = useState<number>(400);
  const [preset, setPreset] = useState<string>('');
  const [customFreq, setCustomFreq] = useState<number | ''>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscLRef = useRef<OscillatorNode | null>(null);
  const oscRRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startTone = () => {
    if (isPlaying) return;
    const beatFreq = customFreq || (preset && presets[preset].freq);
    if (!beatFreq || isNaN(beatFreq as number)) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscL = audioCtx.createOscillator();
    const oscR = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscL.type = 'sine';
    oscR.type = 'sine';
    oscL.frequency.value = baseFreq - beatFreq / 2;
    oscR.frequency.value = baseFreq + beatFreq / 2;

    const merger = audioCtx.createChannelMerger(2);
    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(gain).connect(audioCtx.destination);

    gain.gain.value = 0.1;
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
    setIsPlaying(false);
    audioCtxRef.current = null;
    oscLRef.current = null;
    oscRRef.current = null;
    gainRef.current = null;
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Gerador de Ondas Binaurais
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography gutterBottom>
              Tom base (carrier) [200–600 Hz]: {baseFreq} Hz
            </Typography>
            <Slider
              value={baseFreq}
              onChange={(_, val) => setBaseFreq(val as number)}
              min={200}
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
              setCustomFreq(Number(e.target.value));
              setPreset('');
            }}
            sx={{ mb: 3 }}
          />

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