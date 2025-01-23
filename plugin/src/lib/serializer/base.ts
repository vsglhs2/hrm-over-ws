export abstract class Serializer<A, B> {
    public abstract serialize(a: A): B | PromiseLike<B>;
    public abstract deserialize(b: B): A | PromiseLike<A>;
}
