# Binaural Beat Generator

## Descrição

O **Binaural Beat Generator** é uma aplicação web em **React + TypeScript** que utiliza **Material UI v5** para a interface e a **Web Audio API** para sintetizar ondas binaurais em tempo real. Permite ao usuário ajustar tanto o tom base (carrier) quanto a frequência de batimento (beat), escolhendo presets ou definindo valores personalizados.

---

## Funcionalidades

- **Carrier Tone**  
  Slider para ajustar o tom base entre **200 Hz** e **600 Hz** (padrão em 400 Hz).

- **Presets de Batimento**  
  - **Alfa (10 Hz)**: Relaxamento e meditação (8–12 Hz)  
  - **Teta (6 Hz)**: Criatividade e relaxamento profundo (4–7 Hz)  
  - **Delta (2 Hz)**: Sono profundo e regeneração (0,5–4 Hz)  
  - **Beta (20 Hz)**: Foco, atenção e desempenho cognitivo (13–30 Hz)  
  - **Gamma (40 Hz)**: Processamento cognitivo avançado e alerta (30–100 Hz)

- **Frequência Customizada**  
  Campo numérico para digitar qualquer valor de batimento em Hz.

- **Controles de Reprodução**  
  Botões “Iniciar” e “Parar” que ativam ou interrompem a geração sonora.

- **Volume Seguro**  
  Ganho fixado em 0.1 para garantir conforto auditivo.

---

## Instalação

1. **Clone o repositório**  

   ```bash
   git clone https://github.com/seu-usuario/binaural-beat-generator.git
   cd binaural-beat-generator```
  
2. **Instale as dependências do projeto**  

  ```bash
  npm install```

---

## Estrutura do Projeto

binaural-beat-generator/
├─ src/
│  ├─ pages/
│  │  └─ BinauralBeatGenerator.tsx   # Componente principal
│  ├─ App.tsx                        # Container geral / roteamento
│  └─ index.tsx                      # Ponto de entrada React
├─ public/
│  └─ waves.svg                      # Favicon
├─ package.json
├─ tsconfig.json
├─ index.html                        # Template HTML
└─ README.md                         # Este arquivo

---

## Uso

1. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev```


2. **Abra o navegador na porta destinada a aplicação**  

3. **Ajuste o Slider para definir o Tom Base.**  

4. **Selecione um Preset ou digite uma frequência customizada.**

5. **Clique em Iniciar para ouvir as ondas binaurais; clique em Parar para interromper.**  
