export default class Logger {
  constructor(...prefixes) {
    this.prefixes = prefixes;
    this.separator = ' | ';
    this.enabled = true;
  }

  withPrefix(...newPrefixes) {
    // Возвращаем новый инстанс с расширенными префиксами
    return new Logger(...this.prefixes, ...newPrefixes).setEnabled(this.enabled);
  }

  _buildArgs(args) {
    const pref = this.prefixes.join(this.separator);

    // вставляем разделитель между аргументами
    const separatedArgs = [];
    args.forEach((arg, i) => {
      if (i > 0) separatedArgs.push(this.separator);
      separatedArgs.push(arg);
    });

    return [pref, this.separator, ...separatedArgs];
  }

  log(...args) {
    if (!this.enabled) {
      return
    }

    console.log(...this._buildArgs(args));
  }

  info(...args) {
    if (!this.enabled) {
      return
    }

    console.info(...this._buildArgs(args));
  }

  setEnabled(val) {
    this.enabled = val;

    return this
  }
}
