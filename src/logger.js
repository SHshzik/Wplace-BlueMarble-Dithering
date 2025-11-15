export default class Logger {
  constructor(...prefixes) {
    this.prefixes = prefixes;
    this.separator = ' | ';
  }

  withPrefix(...newPrefixes) {
    // Возвращаем новый инстанс с расширенными префиксами
    return new Logger(...this.prefixes, ...newPrefixes);
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
    console.log(...this._buildArgs(args));
  }

  info(...args) {
    console.info(...this._buildArgs(args));
  }
}
