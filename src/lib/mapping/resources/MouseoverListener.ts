import { SimpleMap } from "../../../helpers/structures";
import { TLDBBaseMap } from "../BaseMap";

type MouseoverFunction = (e: any) => void | Promise<void>;
type MouseoutFunction = (e: any) => void | Promise<void>;

type MouseoverOptions = {
  layer: string;
  pointerCursor?: boolean;
  initialState?: SimpleMap;
};

export class MouseoverListener {
  private onMouseoverFunc?: MouseoverFunction;
  private onMouseoutFunc?: MouseoutFunction;
  public state: SimpleMap;

  constructor(private options: MouseoverOptions) {
    this.state = { ...options.initialState };
  }

  public async onMouseover(func: MouseoverFunction) {
    this.onMouseoverFunc = func;
  }

  public async onMouseout(func: MouseoverFunction) {
    this.onMouseoutFunc = func;
  }

  public async apply(map: TLDBBaseMap) {
    map.on("mouseenter", this.options.layer, async (e) => {
      if (this.options.pointerCursor) {
        map.getCanvas().style.cursor = "pointer";
      }

      await Promise.resolve(this.onMouseoverFunc?.(e));
    });

    map.on("mouseout", this.options.layer, async (e) => {
      if (this.options.pointerCursor) {
        map.getCanvas().style.cursor = "";
      }

      await Promise.resolve(this.onMouseoutFunc?.(e));

      this.state.mousedOut = false;
      this.state = { ...this.options.initialState };
    });
  }
}
