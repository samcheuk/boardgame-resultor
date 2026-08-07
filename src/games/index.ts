import type { GameConfig } from '../types/game';
import { catanConfig } from './catan/config';
import { gloomhavenConfig } from './gloomhaven/config';

export const games: GameConfig[] = [catanConfig, gloomhavenConfig];
