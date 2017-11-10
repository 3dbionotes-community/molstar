/**
 * Copyright (c) 2017 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * from https://github.com/dsehnal/CIFTools.js
 * @author David Sehnal <david.sehnal@gmail.com>
 */

/**
 * A generic chunked array builder.
 *
 * When adding elements, the array growns by a specified number
 * of elements (either linear or exponential growth) and no copying
 * is done until ChunkedArray.compact is called.
 */
interface ChunkedArray<T> {
    ctor: (size: number) => any,
    elementSize: number,

    linearGrowth: boolean,

    initialSize: number,
    allocatedSize: number,
    elementCount: number,

    currentSize: number,
    currentChunk: any,
    currentIndex: number,

    chunks: any[]
}

// TODO: better api, write tests
namespace ChunkedArray {
    export function is(x: any): x is ChunkedArray<any> {
        return x.creator && x.chunkSize;
    }

    function allocateNext(array: ChunkedArray<any>) {
        let nextSize = !array.allocatedSize || array.linearGrowth
            ? array.initialSize * array.elementSize
            : Math.max(Math.ceil(0.61 * array.allocatedSize), 1);
        if (nextSize % array.elementSize !== 0) nextSize += nextSize % array.elementSize;
        array.currentSize = nextSize;
        array.currentIndex = 0;
        array.currentChunk = array.ctor(nextSize);
        array.allocatedSize += nextSize;
        array.chunks[array.chunks.length] = array.currentChunk;
    }

    export function add4<T>(array: ChunkedArray<T>, x: T, y: T, z: T, w: T) {
        if (array.currentIndex >= array.currentSize) allocateNext(array);
        const c = array.currentChunk;
        c[array.currentIndex++] = x;
        c[array.currentIndex++] = y;
        c[array.currentIndex++] = z;
        c[array.currentIndex++] = w;
        return array.elementCount++;
    }

    export function add3<T>(array: ChunkedArray<T>, x: T, y: T, z: T) {
        if (array.currentIndex >= array.currentSize) allocateNext(array);
        const c = array.currentChunk;
        c[array.currentIndex++] = x;
        c[array.currentIndex++] = y;
        c[array.currentIndex++] = z;
        return array.elementCount++;
    }

    export function add2<T>(array: ChunkedArray<T>, x: T, y: T) {
        if (array.currentIndex >= array.currentSize) allocateNext(array);
        const c = array.currentChunk;
        c[array.currentIndex++] = x;
        c[array.currentIndex++] = y;
        return array.elementCount++;
    }

    export function add<T>(array: ChunkedArray<T>, x: T) {
        if (array.currentIndex >= array.currentSize) allocateNext(array);
        array.currentChunk[array.currentIndex++] = x;
        return array.elementCount++;
    }


    export function compact<T>(array: ChunkedArray<T>): ArrayLike<T> {
        const { ctor, chunks, currentIndex } = array;

        if (!chunks.length) return ctor(0);
        if (chunks.length === 1 && currentIndex === array.allocatedSize) {
            return chunks[0];
        }

        const ret = ctor(array.elementSize * array.elementCount);
        let offset = 0;

        if (ret.buffer) {
            for (let i = 0, _i = chunks.length - 1; i < _i; i++) {
                ret.set(chunks[i], offset);
                offset += chunks[i].length;
            }
        } else {
            for (let i = 0, _i = chunks.length - 1; i < _i; i++) {
                const chunk = chunks[i];
                for (let j = 0, _j = chunk.length; j < _j; j++) ret[offset + j] = chunk[j];
                offset += chunk.length;
            }
        }

        const lastChunk = chunks[chunks.length - 1];
        if (ret.buffer && currentIndex >= array.currentSize) {
            ret.set(lastChunk, offset);
        } else {
            for (let j = 0, _j = lastChunk.length; j < _j; j++) ret[offset + j] = lastChunk[j];
        }

        return ret;
    }

    export function create<T>(ctor: (size: number) => any, elementSize: number, initialSize: number, linearGrowth: boolean): ChunkedArray<T> {
        return {
            ctor,
            elementSize,
            linearGrowth,

            initialSize,
            allocatedSize: 0,
            elementCount: 0,

            currentSize: 0,
            currentChunk: void 0,
            currentIndex: 0,

            chunks: []
        } as ChunkedArray<T>;
    }
}

export { ChunkedArray }