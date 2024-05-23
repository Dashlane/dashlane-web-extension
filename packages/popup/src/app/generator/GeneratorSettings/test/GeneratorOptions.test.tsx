import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18N_KEYS } from 'src/app/generator/GeneratorSettings/GeneratorOptionsKeys';
jest.mock('libs/i18n/useTranslate');
import { GeneratorOptions, GeneratorOptionsProps, } from 'src/app/generator/GeneratorSettings/GeneratorOptions';
interface MakeGeneratorOptionsParams {
    digits?: boolean;
    letters?: boolean;
    symbols?: boolean;
}
function makeGeneratorOptions({ digits = false, letters = false, symbols = false, }: MakeGeneratorOptionsParams): GeneratorOptionsProps {
    return {
        options: {
            length: 0,
            digits,
            letters,
            symbols,
            avoidAmbiguous: true,
        },
        onOptionsChanged: jest.fn(),
    };
}
describe('<GeneratorOptions>', () => {
    it('should display 4 checkboxes', () => {
        const generatorOptions = makeGeneratorOptions({});
        render(<GeneratorOptions {...generatorOptions}/>);
        expect(screen.getByRole('checkbox', {
            name: I18N_KEYS.OPTIONS_USE_LETTERS,
        })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', {
            name: I18N_KEYS.OPTIONS_USE_DIGITS,
        })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', {
            name: I18N_KEYS.OPTIONS_USE_SYMBOLS,
        })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', {
            name: I18N_KEYS.OPTIONS_USE_SIMILAR_CHARACTERS,
        })).toBeInTheDocument();
    });
    it('should change use letters option when checking use letter option', () => {
        const generatorOptions = makeGeneratorOptions({ digits: true });
        render(<GeneratorOptions {...generatorOptions}/>);
        const useLettersCheckbox = screen
            .getByRole('checkbox', { name: I18N_KEYS.OPTIONS_USE_LETTERS })
            .closest('label');
        expect(useLettersCheckbox).toBeInTheDocument();
        expect(useLettersCheckbox).not.toBeNull();
        if (useLettersCheckbox === null) {
            return;
        }
        userEvent.click(useLettersCheckbox);
        expect(generatorOptions.onOptionsChanged).toHaveBeenCalledTimes(1);
        expect(generatorOptions.onOptionsChanged).toHaveBeenCalledWith({
            length: 0,
            digits: true,
            letters: true,
            symbols: false,
            avoidAmbiguous: true,
        });
    });
    it('should change use digits option when checking use digits option', () => {
        const generatorOptions = makeGeneratorOptions({ letters: true });
        render(<GeneratorOptions {...generatorOptions}/>);
        const useDigitsCheckbox = screen
            .getByRole('checkbox', { name: I18N_KEYS.OPTIONS_USE_DIGITS })
            .closest('label');
        expect(useDigitsCheckbox).toBeInTheDocument();
        expect(useDigitsCheckbox).not.toBeNull();
        if (useDigitsCheckbox === null) {
            return;
        }
        userEvent.click(useDigitsCheckbox);
        expect(generatorOptions.onOptionsChanged).toHaveBeenCalledTimes(1);
        expect(generatorOptions.onOptionsChanged).toHaveBeenCalledWith({
            length: 0,
            digits: true,
            letters: true,
            symbols: false,
            avoidAmbiguous: true,
        });
    });
    it('should change use symbols option when checking use symbols option', () => {
        const generatorOptions = makeGeneratorOptions({ digits: true });
        render(<GeneratorOptions {...generatorOptions}/>);
        const useSymbolsCheckbox = screen
            .getByRole('checkbox', { name: I18N_KEYS.OPTIONS_USE_SYMBOLS })
            .closest('label');
        expect(useSymbolsCheckbox).toBeInTheDocument();
        expect(useSymbolsCheckbox).not.toBeNull();
        if (useSymbolsCheckbox === null) {
            return;
        }
        userEvent.click(useSymbolsCheckbox);
        expect(generatorOptions.onOptionsChanged).toHaveBeenCalledTimes(1);
        expect(generatorOptions.onOptionsChanged).toHaveBeenCalledWith({
            length: 0,
            digits: true,
            letters: false,
            symbols: true,
            avoidAmbiguous: true,
        });
    });
    it('should prevent letters checkbox from being unchecked when digits unchecked', () => {
        const lettersGeneratorOptions = makeGeneratorOptions({
            letters: true,
            digits: false,
            symbols: true,
        });
        render(<GeneratorOptions {...lettersGeneratorOptions}/>);
        const useLettersCheckbox = screen.getByRole('checkbox', {
            name: I18N_KEYS.OPTIONS_USE_LETTERS,
        });
        expect(useLettersCheckbox).toBeInTheDocument();
        expect(useLettersCheckbox).toBeDisabled();
        userEvent.click(useLettersCheckbox);
        expect(lettersGeneratorOptions.onOptionsChanged).not.toHaveBeenCalled();
    });
    it('should prevent digits checkbox from being unchecked when letters unchecked', () => {
        const digitsGeneratorOptions = makeGeneratorOptions({
            letters: false,
            digits: true,
            symbols: true,
        });
        render(<GeneratorOptions {...digitsGeneratorOptions}/>);
        const useDigitsCheckbox = screen.getByRole('checkbox', {
            name: I18N_KEYS.OPTIONS_USE_DIGITS,
        });
        expect(useDigitsCheckbox).toBeInTheDocument();
        expect(useDigitsCheckbox).toBeDisabled();
        userEvent.click(useDigitsCheckbox);
        expect(digitsGeneratorOptions.onOptionsChanged).not.toHaveBeenCalled();
    });
    it('should change use similar chars option when checking use similar option', () => {
        const generatorOptions = makeGeneratorOptions({ digits: true });
        render(<GeneratorOptions {...generatorOptions}/>);
        const useSimilarCharsCheckbox = screen
            .getByRole('checkbox', {
            name: I18N_KEYS.OPTIONS_USE_SIMILAR_CHARACTERS,
        })
            .closest('label');
        expect(useSimilarCharsCheckbox).toBeInTheDocument();
        expect(useSimilarCharsCheckbox).not.toBeNull();
        if (useSimilarCharsCheckbox === null) {
            return;
        }
        userEvent.click(useSimilarCharsCheckbox);
        expect(generatorOptions.onOptionsChanged).toHaveBeenCalledTimes(1);
        expect(generatorOptions.onOptionsChanged).toHaveBeenCalledWith({
            length: 0,
            digits: true,
            letters: false,
            symbols: false,
            avoidAmbiguous: false,
        });
    });
});
