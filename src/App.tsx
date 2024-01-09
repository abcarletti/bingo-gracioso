import { useEffect } from 'react';
import useBingo from './hooks/use-bingo';
import { BingoNumber } from './data/models';

const synth = window.speechSynthesis;

function App() {
  const {
    dashboard,
    isPlaying,
    isStarted,
    currentNumber,
    countNumbers,
    lastNumbers,
    startBingo,
    resetBingo,
    getNextNumber,
    changePlaying,
  } = useBingo();

  const tellNumber = ({ text, variant }: BingoNumber) => {
    tellText(`${text}, ${variant}`);
  };

  const tellText = (text: string, callback?: () => void) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = () => {
      callback && callback();
    };
    utterThis.lang = 'es-ES';
    synth.speak(utterThis);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (countNumbers === 2) {
        tellText('Oye, ¿y si canto línea antes que bingo?');
      } else if (countNumbers === 90) {
        resetBingo();
        tellText('Se resetea el bingo, ¿estáis dormidos?');
      }
      if (isPlaying) {
        const number = getNextNumber();
        if (number) {
          tellNumber(number);
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [
    countNumbers,
    isPlaying,
    changePlaying,
    tellNumber,
    getNextNumber,
    resetBingo,
  ]);

  return (
    <>
      <main className='h-screen bg-slate-700'>
        <header className='p-4 bg-red-400 flex align-middle justify-center items-center'>
          <h1 className='text-3xl text-center'>Bingo gracioso</h1>
        </header>
        <section className='grid grid-cols-10 bg-slate-400'>
          {dashboard &&
            dashboard.map((number) => (
              <span
                className={`py-1 text-center ${
                  number.selected ? 'bg-green-300' : ''
                }`}
              >
                {number.id}
              </span>
            ))}
        </section>
        <section className='grid grid-cols-8 justify-center align-middle items-center my-10'>
          {lastNumbers &&
            lastNumbers.map((number) => (
              <div
                key={number.id}
                className='flex bg-amber-100 size-14 rounded-full justify-center items-center'
              >
                <span className='text-3xl'>{number.id}</span>
              </div>
            ))}
        </section>
        <section className='flex justify-center align-middle items-center my-10'>
          <div className='flex bg-amber-200 size-32 rounded-full justify-center items-center'>
            <span className='text-8xl'>{currentNumber?.id || 0}</span>
          </div>
        </section>
        <footer className='mt-10 flex justify-around'>
          {!isStarted && (
            <button
              className='flex bg-green-400 p-2 rounded-md min-w-44 justify-center'
              onClick={() => {
                tellText('Empezamos a jugar curriis');
                setTimeout(() => {
                  startBingo();
                }, 1000);
              }}
            >
              Empezar a jugar
            </button>
          )}
          {isStarted && (
            <button
              className='flex bg-green-400 p-2 rounded-md min-w-44 justify-center'
              onClick={changePlaying}
            >
              {isPlaying ? 'Pausar' : 'Jugar'}
            </button>
          )}

          <button
            className='bg-green-400 p-2 rounded-md min-w-44 justify-center disabled:bg-gray-400 disabled:cursor-not-allowed'
            disabled={!isStarted || isPlaying}
            onClick={resetBingo}
          >
            Volver a empezar
          </button>
        </footer>
      </main>
    </>
  );
}

export default App;
