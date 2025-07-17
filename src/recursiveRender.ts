import { Handlebars } from './Handlebars';

/**
 * Recursively renders a Handlebars template string using the given context/data,
 * re-compiling the output until it stabilizes or a max depth is reached.
 *
 * @param template - The template string to render.
 * @param context - The context object used for rendering.
 * @param options - Optional Handlebars compile options.
 * @param maxDepth - Maximum number of recursive passes (default: 10).
 * @returns The fully rendered string.
 */
export function recursiveRender<T extends object>(
  template: string,
  context: T,
  options: CompileOptions = {},
  maxDepth = 10,
): string {
  let output: string = Handlebars.compile(template, options)(context);
  let lastOutput = '';
  let depth = 0;

  while (output !== lastOutput && depth < maxDepth) {
    lastOutput = output;
    output = Handlebars.compile(lastOutput, options)(context);
    depth++;
  }
  return output;
}
