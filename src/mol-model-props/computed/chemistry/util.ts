/**
 * Copyright (c) 2019 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Structure, Unit } from 'mol-model/structure';
import { StructureElement } from 'mol-model/structure/structure';
import { Elements } from 'mol-model/structure/model/properties/atomic/types';

export function typeSymbol(unit: Unit.Atomic, index: StructureElement.UnitIndex) {
    return unit.model.atomicHierarchy.atoms.type_symbol.value(unit.elements[index])
}

export function formalCharge(unit: Unit.Atomic, index: StructureElement.UnitIndex) {
    return unit.model.atomicHierarchy.atoms.pdbx_formal_charge.value(unit.elements[index])
}

//

export function interBondCount(structure: Structure, unit: Unit.Atomic, index: StructureElement.UnitIndex): number {
    return structure.interUnitLinks.getBondIndices(index, unit).length
}

export function intraBondCount(unit: Unit.Atomic, index: StructureElement.UnitIndex): number {
    const { offset } = unit.links
    return offset[index + 1] - offset[index]
}

export function bondCount(structure: Structure, unit: Unit.Atomic, index: StructureElement.UnitIndex): number {
    return interBondCount(structure, unit, index) + intraBondCount(unit, index)
}

export function bondToElementCount(structure: Structure, unit: Unit.Atomic, index: StructureElement.UnitIndex, element: Elements): number {
    let count = 0
    eachBondedAtom(structure, unit, index, (unit: Unit.Atomic, index: StructureElement.UnitIndex) => {
        if (typeSymbol(unit, index) === element) count += 1
    })
    return count
}

//

export function eachInterBondedAtom(structure: Structure, unit: Unit.Atomic, index: StructureElement.UnitIndex, cb: (unit: Unit.Atomic, index: StructureElement.UnitIndex) => void): void {
    // inter
    const interIndices = structure.interUnitLinks.getBondIndices(index, unit)
    for (let i = 0, il = interIndices.length; i < il; ++i) {
        const b = structure.interUnitLinks.bonds[i]
        cb(b.unitB, b.indexB)
    }
}

export function eachIntraBondedAtom(unit: Unit.Atomic, index: StructureElement.UnitIndex, cb: (unit: Unit.Atomic, index: StructureElement.UnitIndex) => void): void {
    // intra
    const { offset, b } = unit.links
    for (let i = offset[index], il = offset[index + 1]; i < il; ++i) {
        cb(unit, b[i] as StructureElement.UnitIndex)
    }
}

export function eachBondedAtom(structure: Structure, unit: Unit.Atomic, index: StructureElement.UnitIndex, cb: (unit: Unit.Atomic, index: StructureElement.UnitIndex) => void): void {
    eachInterBondedAtom(structure, unit, index, cb)
    eachIntraBondedAtom(unit, index, cb)
}