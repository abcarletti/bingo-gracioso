import { useState } from 'react';
import { BingoNumber } from '../data/models';
import { bingoNumbers } from '../data/numbers';

const useBingo = () => {
  const [dashboard, setDashboard] = useState(bingoNumbers);
  const [countNumbers, setCountNumbers] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<BingoNumber | undefined>();
  const [lastNumbers, setLastNumbers] = useState<BingoNumber[]>([]);

  const startBingo = () => {
    setIsStarted(true);
    setIsPlaying(true);
  };

  const resetBingo = () => {
    setIsStarted(false);
    setIsPlaying(false);
    setLastNumbers([]);
    console.log('setLastNumbers([])');
    setCurrentNumber(undefined);
    setDashboard(bingoNumbers);
    setCountNumbers(0);
  };

  const getRandomNumberNotSelected = (): BingoNumber => {
    const numbersNotSelected = desorderArray(
      dashboard.filter((number) => !number.selected)
    );
    const random = Math.floor(Math.random() * numbersNotSelected.length);
    return numbersNotSelected[random];
  };

  const getNextNumber = (): BingoNumber | null => {
      const randomNumber = getRandomNumberNotSelected();
      if (randomNumber) {
          if (currentNumber) {
            if (lastNumbers.length < 8) {
              setLastNumbers([...lastNumbers, currentNumber]);
            } else if (lastNumbers.length >= 8) {
              setLastNumbers([
                lastNumbers[1],
                lastNumbers[2],
                lastNumbers[3],
                lastNumbers[4],
                lastNumbers[5],
                lastNumbers[6],
                lastNumbers[7],
                currentNumber,
              ]);
            }
          }
          setCurrentNumber(randomNumber);
          setDashboard(
            dashboard.map((number) =>
              number.id === randomNumber.id
                ? { ...number, selected: true }
                : number
            )
          );
          setCountNumbers(countNumbers + 1);
          return randomNumber;
      }
      return null;
  };

  const changePlaying = () => {
    setIsPlaying(!isPlaying);
  };

  return {
    dashboard,
    isPlaying,
    isStarted,
    currentNumber,
    countNumbers,
    lastNumbers,
    startBingo,
    resetBingo,
    changePlaying,
    getNextNumber,
  };
};

const desorderArray = (array: BingoNumber[]): BingoNumber[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default useBingo;
