/**
 * Digit-wheel input — minimal numeric entry for G2.
 *
 * Per-slot value: `null` (un-entered, shown as `_`), 0-9, or BACK (-1, shown as `<`).
 *
 * Initial state:
 *   All slots = `null`, cursor at slot 0.
 *   When the cursor lands on an un-entered slot, that slot is implicitly
 *   initialised to 0 (so cursor 0 actually shows `[0]` on first render).
 *
 * Gestures (handled by the owner; this class only mutates state):
 *   - SCROLL_TOP    -> bump(+1)
 *   - SCROLL_BOTTOM -> bump(-1)
 *   - CLICK         -> tap(): if current is BACK, go back & clear; else advance
 *   - DOUBLE_CLICK  -> caller reads `value()` and commits
 *
 * Cycle (used by bump):
 *   0 -> 1 -> 2 -> ... -> 9 -> BACK -> 0 -> ...
 *
 * Tap on `<` rules:
 *   - At cursor 0: simply replace `<` with 0 (can't back further).
 *   - At cursor > 0: clear current slot to `null`, move cursor left. The slot we
 *     land on keeps whatever value it had (so backing up doesn't erase the
 *     previously typed digit).
 */
export const SLOTS = 6
export const BACK = -1

const CYCLE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, BACK]

type Slot = number | null

export class DigitWheel {
  private digits: Slot[] = new Array(SLOTS).fill(null)
  private cursor = 0

  constructor() {
    // Cursor slot starts at 0 (un-entered slots are initialised on arrival).
    this.digits[0] = 0
  }

  reset(): void {
    this.digits = new Array(SLOTS).fill(null)
    this.cursor = 0
    this.digits[0] = 0
  }

  bump(delta: 1 | -1): void {
    const cur = this.digits[this.cursor] ?? 0
    let i = CYCLE.indexOf(cur)
    if (i < 0) i = 0
    i = (i + delta + CYCLE.length) % CYCLE.length
    this.digits[this.cursor] = CYCLE[i]
  }

  tap(): 'advance' | 'back' | 'noop' {
    const cur = this.digits[this.cursor]
    if (cur === BACK) {
      if (this.cursor === 0) {
        this.digits[0] = 0  // reset back to 0 (can't go further left)
        return 'noop'
      }
      this.digits[this.cursor] = null  // erase the slot we leave
      this.cursor -= 1
      // The slot we land on keeps its prior value (preserves typed-then-backed UX).
      return 'back'
    }
    // Advance: only if not at the last slot.
    if (this.cursor < SLOTS - 1) {
      this.cursor += 1
      if (this.digits[this.cursor] === null) this.digits[this.cursor] = 0
    }
    return 'advance'
  }

  /** Numeric value. Walks digits left-to-right; stops at the first null or BACK. */
  value(): number {
    let n = 0
    for (let i = 0; i < this.digits.length; i++) {
      const d = this.digits[i]
      if (d === null || d === BACK) break
      n = n * 10 + d
    }
    return n
  }

  /** " 1  2 [<] _  _  _ " — cursor wrapped in `[ ]`. */
  render(): string {
    return this.digits.map((d, i) => {
      const ch = d === null ? '_' : d === BACK ? '<' : String(d)
      return i === this.cursor ? `[${ch}]` : ` ${ch} `
    }).join('')
  }
}
