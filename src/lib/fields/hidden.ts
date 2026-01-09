export interface HiddenFieldOptions {
    value: string;
}

export interface HiddenFieldSchema {
    type: "hidden";
    value: string;
}

export function hidden(options: HiddenFieldOptions): HiddenFieldSchema {
    return {
      type: "hidden",
      value: options.value,
    };
  }