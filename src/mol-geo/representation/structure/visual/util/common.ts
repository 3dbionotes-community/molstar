/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import { Unit } from 'mol-model/structure';
import { Mat4 } from 'mol-math/linear-algebra'

import { createUniformColor, ColorData } from '../../../../util/color-data';
import { createUniformSize, SizeData } from '../../../../util/size-data';
import { physicalSizeData } from '../../../../theme/structure/size/physical';
import VertexMap from '../../../../shape/vertex-map';
import { ColorTheme, SizeTheme } from '../../../../theme';
import { elementIndexColorData, elementSymbolColorData, instanceIndexColorData, chainIdColorData } from '../../../../theme/structure/color';
import { ValueCell, defaults } from 'mol-util';
import { LocationIterator } from './location-iterator';
import { carbohydrateSymbolColorData } from '../../../../theme/structure/color/carbohydrate-symbol';

export function createTransforms({ units }: Unit.SymmetryGroup, transforms?: ValueCell<Float32Array>) {
    const unitCount = units.length
    const n = unitCount * 16
    const array = transforms && transforms.ref.value.length >= n ? transforms.ref.value : new Float32Array(n)
    for (let i = 0; i < unitCount; i++) {
        Mat4.toArray(units[i].conformation.operator.matrix, array, i * 16)
    }
    return transforms ? ValueCell.update(transforms, array) : ValueCell.create(array)
}

const identityTransform = new Float32Array(16)
Mat4.toArray(Mat4.identity(), identityTransform, 0)
export function createIdentityTransform(transforms?: ValueCell<Float32Array>) {
    return transforms ? ValueCell.update(transforms, identityTransform) : ValueCell.create(identityTransform)
}

export function createColors(locationIt: LocationIterator, props: ColorTheme, colorData?: ColorData) {
    switch (props.name) {
        case 'atom-index':
            return elementIndexColorData(locationIt, colorData)
        case 'carbohydrate-symbol':
            return carbohydrateSymbolColorData(locationIt, props, colorData)
        case 'chain-id':
            return chainIdColorData(locationIt, colorData)
        case 'element-symbol':
            return elementSymbolColorData(locationIt, colorData)
        case 'instance-index':
            return instanceIndexColorData(locationIt, colorData)
        case 'uniform':
            return createUniformColor(locationIt, () => props.value || 0x000000, colorData)
    }
}

// export function createLinkColors(group: Unit.SymmetryGroup, props: ColorTheme, colorData?: ColorData): ColorData {
//     switch (props.name) {
//         case 'atom-index':
//         case 'chain-id':
//         case 'element-symbol':
//         case 'instance-index':
//             return chainIdLinkColorData({ group, vertexMap }, colorData)
//         case 'uniform':
//             return createUniformColor(props, colorData)
//     }
// }

export function createSizes(group: Unit.SymmetryGroup, vertexMap: VertexMap, props: SizeTheme): SizeData {
    switch (props.name) {
        case 'uniform':
            return createUniformSize(props)
        case 'physical':
            return physicalSizeData(defaults(props.factor, 1), { group, vertexMap })
    }
}