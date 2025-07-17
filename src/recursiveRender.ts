import { Handlebars } from './Handlebars';

/**
 * Recursively renders a Handlebars template string using the given context/data,
 * re-compiling the output until it stabilizes or a max depth is reached.
 *
 * @param h - The Handlebars instance to use for rendering.
 * @param template - The template string to render.
 * @param context - The context object used for rendering.
 * @param options - Optional Handlebars compile options.
 * @param maxDepth - Maximum number of recursive passes (default: 10).
 * @returns The fully rendered string.
 */
export function recursiveRender<T extends object>(
  h: typeof Handlebars,
  template: string,
  context: T,
  options: CompileOptions = {},
  maxDepth = 10,
): string {
  let output: string = h.compile(template, options)(context);
  let lastOutput = '';
  let depth = 0;

  while (output !== lastOutput && depth < maxDepth) {
    lastOutput = output;
    output = h.compile(lastOutput, options)(context);
    depth++;
  }
  return output;
}
