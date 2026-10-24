import { h } from "vue";

// IpInput — IP / IPv6 / MAC 分段输入控件(Element Plus 无此组件,skill 内置)
// type 决定段数/分隔符/字符集:ipv4 = 4段"."十进制,ipv6 = 8段":"十六进制小写,
// mac = 6段"-"十六进制大写。v-model 为完整字符串(如 "192.168.1.1");
// 分段 blur 时归一化钳制(ipv4 钳 0-255,mac/ipv6 补零)。
//
// 用法: import IpInput from "./assets/shared/ip-input.js"
//        <IpInput v-model="form.ip" type="ipv4" size="middle" />

const MODES = {
  ipv4: { sep: ".", count: 4, maxLen: 3, dotSep: true, filter: (s) => s.replace(/[^0-9]/g, "") },
  ipv6: { sep: ":", count: 8, maxLen: 4, filter: (s) => s.replace(/[^0-9a-fA-F]/g, "").toLowerCase() },
  mac: { sep: "-", count: 6, maxLen: 2, filter: (s) => s.replace(/[^0-9a-fA-F]/g, "").toUpperCase() },
};

// size 刻度对齐设计系统 Input/Button/InputNumber:large=2.5rem/16px,middle=2rem/14px,small=1.75rem/12px
const SIZES = {
  large: { height: "2.5rem", padding: "0 0.75rem", gap: "0.375rem", font: "var(--font-body-l)", dot: "0.25rem" },
  middle: { height: "2rem", padding: "0 0.75rem", gap: "0.25rem", font: "var(--font-body-m)", dot: "0.1875rem" },
  small: { height: "1.75rem", padding: "0 0.75rem", gap: "0.1875rem", font: "var(--font-body-s)", dot: "0.125rem" },
};

function segmentsFromValue(value, cfg) {
  const parts = String(value ?? "").split(cfg.sep);
  const segs = [];
  for (let i = 0; i < cfg.count; i++) segs.push(parts[i] ?? "");
  return segs;
}

export default {
  name: "IpInput",
  props: {
    type: { type: String, default: "ipv4" },
    size: { type: String, default: "middle" },
    modelValue: { type: String, default: "" },
    status: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: "" },
  },
  emits: ["update:modelValue", "focus", "blur"],
  data() {
    return {
      segs: segmentsFromValue(this.modelValue, MODES[this.type] || MODES.ipv4),
      focused: false,
    };
  },
  computed: {
    cfg() {
      return MODES[this.type] || MODES.ipv4;
    },
    sz() {
      return SIZES[this.size] || SIZES.middle;
    },
    borderColor() {
      if (this.status === "error") return "var(--color-error)";
      if (this.focused) return "var(--color-border-focus)";
      return "var(--gray-20)";
    },
  },
  watch: {
    modelValue(v) {
      this.segs = segmentsFromValue(v, this.cfg);
    },
    type() {
      this.segs = segmentsFromValue(this.modelValue, this.cfg);
    },
  },
  methods: {
    emit(next) {
      this.$emit("update:modelValue", next.join(this.cfg.sep));
    },
    onInput(i, e) {
      const next = [...this.segs];
      next[i] = this.cfg.filter(e.target.value).slice(0, this.cfg.maxLen);
      this.segs = next;
      this.emit(next);
    },
    onBlurSeg(i) {
      const next = [...this.segs];
      const s = next[i];
      if (this.type === "ipv4") {
        let n = parseInt(s, 10);
        if (Number.isNaN(n)) n = 0;
        next[i] = String(Math.min(255, Math.max(0, n)));
      } else if (this.type === "mac") {
        next[i] = (s || "0").padStart(2, "0");
      } else {
        next[i] = (s || "0").toLowerCase();
      }
      this.segs = next;
      this.emit(next);
      this.$emit("blur", next.join(this.cfg.sep));
    },
  },
  render() {
    const cfg = this.cfg;
    const sz = this.sz;
    const segStyle = {
      width: `${cfg.maxLen + 1}ch`,
      border: "none",
      outline: "none",
      background: "var(--color-fill-subtle)",
      padding: 0,
      textAlign: "center",
      color: "var(--color-text-primary)",
      font: sz.font,
    };

    const children = [];
    for (let i = 0; i < cfg.count; i++) {
      children.push(
        h("input", {
          key: `seg-${i}`,
          id: i === 0 ? this.id || undefined : undefined,
          value: this.segs[i],
          disabled: this.disabled || undefined,
          maxlength: cfg.maxLen,
          onInput: (e) => this.onInput(i, e),
          onBlur: () => this.onBlurSeg(i),
          style: segStyle,
        })
      );
      if (i < cfg.count - 1) {
        children.push(
          cfg.dotSep
            ? h("span", {
                key: `sep-${i}`,
                style: {
                  width: sz.dot,
                  height: sz.dot,
                  borderRadius: "50%",
                  background: "var(--color-text-secondary)",
                  flexShrink: 0,
                },
              })
            : h(
                "span",
                {
                  key: `sep-${i}`,
                  style: { color: "var(--color-text-secondary)", userSelect: "none", font: sz.font },
                },
                cfg.sep
              )
        );
      }
    }

    return h(
      "div",
      {
        onFocusin: () => {
          this.focused = true;
          this.$emit("focus", this.segs.join(cfg.sep));
        },
        onFocusout: () => {
          this.focused = false;
        },
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: sz.gap,
          height: sz.height,
          padding: sz.padding,
          border: `1px solid ${this.borderColor}`,
          borderRadius: "4px",
          boxShadow: this.focused ? "0 0 0 1px var(--color-brand-disabled)" : "none",
          background: this.disabled ? "var(--color-fill-disabled-subtle)" : "var(--color-fill-subtle)",
          opacity: this.disabled ? 0.6 : 1,
          cursor: this.disabled ? "not-allowed" : "text",
        },
      },
      children
    );
  },
};
