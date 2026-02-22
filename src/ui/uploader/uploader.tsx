import { Component, createRef } from 'preact';

import Logger from '../../services/logger.ts';
import styles from './uploader.module.css';
import { TemplateManagerContext } from '../../services/template_manger';

export default class Uploader extends Component {
  static contextType = TemplateManagerContext;

  private logger = new Logger(['Uploader']);
  private fileInputRef = createRef<HTMLInputElement>();

  handleChooseFile = () => {
    this.fileInputRef.current?.click();
  };

  handleCreate = () => {
    const file = this.fileInputRef.current?.files?.[0];
    if (!file) {
      this.logger.log('Файл не выбран');
      return;
    }
    this.context.createTemplate(file);
  };

  render() {
    return (
      <div className={styles.row}>
        <input
          ref={this.fileInputRef}
          type='file'
          className={styles.fileInputHidden}
          accept='image/*'
        />
        <button
          type='button'
          className={styles.button}
          onClick={this.handleChooseFile}
        >
          Файл
        </button>
        <button
          type='button'
          className={styles.button}
          onClick={this.handleCreate}
        >
          Create
        </button>
      </div>
    );
  }
}
