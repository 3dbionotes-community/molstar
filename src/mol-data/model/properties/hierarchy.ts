/**
 * Copyright (c) 2017 molio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import Column from '../../../mol-base/collections/column'
import Table from '../../../mol-base/collections/table'
import IntervalSegmentation from '../../../mol-base/collections/integer/segmentation'
import { Schema as mmCIF } from '../../../mol-io/reader/cif/schema/mmcif'

const _esCache = Object.create(null);
export interface ElementSymbol extends String { '@type': 'element-symbol' }
export function ElementSymbol(s: string): ElementSymbol {
    return _esCache[s] || (_esCache[s] = s.toUpperCase());
}

export const AtomsSchema = {
    type_symbol: Column.Type.aliased<ElementSymbol>(mmCIF.atom_site.type_symbol),
    label_atom_id: mmCIF.atom_site.label_atom_id,
    auth_atom_id: mmCIF.atom_site.auth_atom_id,
    label_alt_id: mmCIF.atom_site.label_alt_id,
    pdbx_formal_charge: mmCIF.atom_site.pdbx_formal_charge
    // id, occupancy and B_iso_or_equiv are part of conformation
};

export type AtomsSchema = typeof AtomsSchema
export interface Atoms extends Table<AtomsSchema> { }

export const ResiduesSchema = {
    group_PDB: mmCIF.atom_site.group_PDB,
    label_comp_id: mmCIF.atom_site.label_comp_id,
    auth_comp_id: mmCIF.atom_site.auth_comp_id,
    label_seq_id: mmCIF.atom_site.label_seq_id,
    auth_seq_id: mmCIF.atom_site.auth_seq_id,
    pdbx_PDB_ins_code: mmCIF.atom_site.pdbx_PDB_ins_code
};
export type ResiduesSchema = typeof ResiduesSchema
export interface Residues extends Table<ResiduesSchema> { }

export const ChainsSchema = {
    label_asym_id: mmCIF.atom_site.label_asym_id,
    auth_asym_id: mmCIF.atom_site.auth_asym_id,
    auth_comp_id: mmCIF.atom_site.auth_comp_id,
    label_entity_id: mmCIF.atom_site.label_entity_id
}
export type ChainsSchema = typeof ChainsSchema
export interface Chains extends Table<ChainsSchema> { }

export const EntitySchema = mmCIF['entity']
export type EntitySchema = typeof EntitySchema
export interface Entities extends Table<EntitySchema> { }

export interface Data {
    atoms: Atoms,
    residues: Residues,
    chains: Chains,
    entities: Entities
}

export interface Segments {
    residueSegments: IntervalSegmentation,
    chainSegments: IntervalSegmentation
}

export interface Keys {
    // indicate whether the keys form an increasing sequence and within each chain, sequence numbers 
    // are in increasing order.
    // monotonous sequences enable for example faster secodnary structure assignment.
    isMonotonous: boolean,

    // assign a key to each residue index.
    residueKey: ArrayLike<number>,
    // assign a key to each chain index
    chainKey: ArrayLike<number>,
    // assigne a key to each chain index
    // also index to the Entities table.
    entityKey: ArrayLike<number>,

    findEntityKey(id: string): number,
    findChainKey(entityId: string, label_asym_id: string): number,
    findResidueKey(entityId: string, label_asym_id: string, label_comp_id: string, auth_seq_id: number, pdbx_PDB_ins_code: string): number
}

type _Hierarchy = Data & Segments & Keys
export interface Hierarchy extends _Hierarchy { }

export default Hierarchy