/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

// adapted from three.js, MIT License Copyright 2010-2018 three.js authors

import { Polyhedron } from './polyhedron'

const t = ( 1 + Math.sqrt( 5 ) ) / 2;

const vertices = [
    - 1, t, 0, 	1, t, 0, 	- 1, - t, 0, 	1, - t, 0,
     0, - 1, t, 	0, 1, t,	0, - 1, - t, 	0, 1, - t,
     t, 0, - 1, 	t, 0, 1, 	- t, 0, - 1, 	- t, 0, 1
];

const indices = [
     0, 11, 5, 	0, 5, 1, 	0, 1, 7, 	0, 7, 10, 	0, 10, 11,
     1, 5, 9, 	5, 11, 4,	11, 10, 2,	10, 7, 6,	7, 1, 8,
     3, 9, 4, 	3, 4, 2,	3, 2, 6,	3, 6, 8,	3, 8, 9,
     4, 9, 5, 	2, 4, 11,	6, 2, 10,	8, 6, 7,	9, 8, 1
];

export function icosahedronVertexCount(detail: number) {
    return 10 * Math.pow(Math.pow(2, detail), 2) + 2
}

export const DefaultIcosahedronProps = {
    radius: 1,
    detail: 0
}
export type IcosahedronProps = Partial<typeof DefaultIcosahedronProps>

export function Icosahedron(props?: IcosahedronProps) {
    return Polyhedron(vertices, indices, { ...DefaultIcosahedronProps, ...props })
}