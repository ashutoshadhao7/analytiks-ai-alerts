import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

export type LetterType = 'lowercase' | 'uppercase' | 'numbers' | 'symbols';
export const lowercaseRegex = /[a-z]/;
export const uppercaseRegex = /[A-Z]/;
export const numberRegex = /[0-9]/;
export const symbolRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
export const MIN_LENGTH = 8;
export const MAX_LENGTH = 40;

const letters: { [key in LetterType]: string } = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#%',
};

@Injectable()
export class PasswordService {
  generatePassword(minLength = 8): string {
    /**
     * create only numeric temporary passwords for now, remove comments or commented code as required
     *
     * also update backend\test\models\Auth.ts to keep it in sync with temporary password policy
     * if user password policy is also be to updated, appropriate DTOs will also need to be updated
     */

    // const charSet = letters.lowercase + letters.uppercase + letters.numbers + letters.symbols;
    const charSet = letters.numbers;
    const strictRules: { name: LetterType; rule: RegExp }[] = [
      { name: 'lowercase', rule: lowercaseRegex },
      { name: 'uppercase', rule: uppercaseRegex },
      { name: 'numbers', rule: numberRegex },
      { name: 'symbols', rule: symbolRegex },
    ];

    let password = '';
    let symbolCount = 0;
    const getCharSet = (): string => {
      const c = charSet[Math.floor(Math.random() * charSet.length)];
      const isSymbol = letters.symbols.includes(c);
      if (!isSymbol) {
        return c;
      } else if (symbolCount >= 2) {
        return getCharSet();
      }
      symbolCount++;
      return c;
    };
    for (let i = 0; i < minLength; i++) {
      password += getCharSet();
    }

    // Iterate over each rule and add append the missing rule value at the end of the password.
    strictRules.forEach((rule) => {
      if (!rule.rule.test(password)) {
        const letterType = letters[rule.name];
        password += letterType[Math.floor(Math.random() * letterType.length)];
      }
    });

    return password;
  }

  async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 10);
  }

  async comparePassword(
    passwordToCompare: string,
    originalHashedPassword: string,
  ): Promise<boolean> {
    return bcryptjs.compare(passwordToCompare, originalHashedPassword);
  }
}
