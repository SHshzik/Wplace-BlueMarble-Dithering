import { Component } from "preact";
import colorPalette from "../../data/color_palette.json";
import styles from "./colors.module.css";
import { TemplateManagerContext } from "../../services/template_manger";

type ColorEntry = {
  id: number;
  premium: boolean;
  name: string;
  rgb: [number, number, number];
};

const fullPalette = colorPalette as ColorEntry[];

export default class Colors extends Component {
  static contextType = TemplateManagerContext;

  render() {
    const colorSetSignal = this.context?.colorSetSignal ?? null;
    const colorSet = colorSetSignal?.value ?? [];

    const entries = colorSet
      .map((cs) => {
        const color = fullPalette.find((c) => c.id === cs.id);
        return color ? { color, count: cs.count } : null;
      })
      .filter((e): e is { color: ColorEntry; count: number } => e != null);

    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.buttonsRow}>
            <button type="button" className={styles.button}>
              Enable All
            </button>
            <button type="button" className={styles.button}>
              Disable All
            </button>
          </div>
          <div className={styles.list}>
            {entries.length === 0 ? (
              <span className={styles.label}>
                Загрузите шаблон, чтобы увидеть цвета
              </span>
            ) : (
              entries.map(({ color, count }) => {
                const [r, g, b] = color.rgb;
                const star = color.premium ? "★ " : "";
                const labelText = `#${color.id} ${star}${color.name} • ${count}/0`;
                return (
                  <div key={color.id} className={styles.row}>
                    <input type="checkbox" defaultChecked />
                    <div
                      className={styles.swatch}
                      style={{
                        background:
                          color.name === "Transparent"
                            ? "#deface"
                            : `rgb(${r}, ${g}, ${b})`,
                      }}
                    />
                    <span className={styles.label}>{labelText}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    );
  }
}
