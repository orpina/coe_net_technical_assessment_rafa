import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'booleanToYesNo'
})
export class BooleanToYesNoPipe implements PipeTransform {
    transform(value: boolean | string): string {
        if (value === null || value === undefined) {
            return 'Unknown';
        }

        if (typeof value === 'string') {
            value = value.toLowerCase() === 'true';
        }

        return value ? 'Yes' : 'No';
    }
}