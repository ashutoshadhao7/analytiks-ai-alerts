import { Transform } from 'class-transformer';

/**
 * A custom transformer which takes an array of options and perform transformations,
 * according to the given order of options.
 * @param options set of operations needed to be performed
 * @returns
 */
export function CustomOptionsTransformer(...options: CustomTransformOptions) {
  return Transform(({ value }: { value: string | undefined | null }) => {
    if (!value || !options?.length) {
      return value;
    }

    options.forEach((key) => {
      switch (key) {
        case 'uppercase': {
          value = value?.toUpperCase();
          break;
        }
        case 'lowercase': {
          value = value?.toLowerCase();
          break;
        }
        case 'trim': {
          value = value?.trim();
          break;
        }
      }
    });
    return value;
  });
}

type CustomTransformOptions = ('uppercase' | 'lowercase' | 'trim')[];
