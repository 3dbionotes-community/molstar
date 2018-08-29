/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import { Unit, StructureElement, StructureProperties as Props } from 'mol-model/structure';
import { Loci } from 'mol-model/loci';
import { OrderedSet } from 'mol-data/int';

// for `labelFirst`, don't create right away to avaiod problems with circular dependencies/imports
let elementLocA: StructureElement
let elementLocB: StructureElement

function setElementLocation(loc: StructureElement, unit: Unit, index: StructureElement.UnitIndex) {
    loc.unit = unit
    loc.element = unit.elements[index]
}

export function labelFirst(loci: Loci): string {
    if (!elementLocA) elementLocA = StructureElement.create()
    if (!elementLocB) elementLocB = StructureElement.create()

    switch (loci.kind) {
        case 'element-loci':
            const e = loci.elements[0]
            if (e) {
                const el = e.unit.elements[OrderedSet.getAt(e.indices, 0)];
                return elementLabel(StructureElement.create(e.unit, el))
            } else {
                return 'Unknown'
            }
        case 'link-loci':
            const bond = loci.links[0]
            if (bond) {
                setElementLocation(elementLocA, bond.aUnit, bond.aIndex)
                setElementLocation(elementLocB, bond.bUnit, bond.bIndex)
                return `${elementLabel(elementLocA)} - ${elementLabel(elementLocB)}`
            } else {
                return 'Unknown'
            }
        case 'group-loci':
            const g = loci.groups[0]
            if (g) {
                return g.shape.labels.ref.value[OrderedSet.getAt(g.ids, 0)]
            } else {
                return 'Unknown'
            }
        case 'every-loci':
            return 'Everything'
        case 'empty-loci':
            return 'Nothing'
    }
}

export function elementLabel(loc: StructureElement) {
    const model = loc.unit.model.label
    const instance = loc.unit.conformation.operator.name
    let element = ''

    if (Unit.isAtomic(loc.unit)) {
        const asym_id = Props.chain.auth_asym_id(loc)
        const seq_id = Props.residue.auth_seq_id(loc)
        const comp_id = Props.residue.auth_comp_id(loc)
        const atom_id = Props.atom.auth_atom_id(loc)
        element = `[${comp_id}]${seq_id}:${asym_id}.${atom_id}`
    } else if (Unit.isCoarse(loc.unit)) {
        const asym_id = Props.coarse.asym_id(loc)
        const seq_id_begin = Props.coarse.seq_id_begin(loc)
        const seq_id_end = Props.coarse.seq_id_end(loc)
        if (seq_id_begin === seq_id_end) {
            const entityKey = Props.coarse.entityKey(loc)
            const seq = loc.unit.model.sequence.byEntityKey[entityKey]
            const comp_id = seq.compId.value(seq_id_begin - 1) // 1-indexed
            element = `[${comp_id}]${seq_id_begin}:${asym_id}`
        } else {
            element = `${seq_id_begin}-${seq_id_end}:${asym_id}`
        }
    } else {
        element = 'unknown'
    }

    return `${model} ${instance} ${element}`
}