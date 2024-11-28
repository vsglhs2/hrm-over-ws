export type BalancerOptions = {
    max: number;
};

export class Balancer {
    private max: number;
    private _current: number;

    constructor(options: BalancerOptions) {
        this.max = options.max;
        this._current = 0;
    }

    current() {
        return this._current;
    }

    next() {
        const current = this._current;
        this._current++;

        if (this._current === this.max)
            this._current = 0;

        return current;
    }
}
