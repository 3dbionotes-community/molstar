/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { readFile, readUrl } from 'mol-util/read'
import { idFactory } from 'mol-util/id-factory'
import { StateContext } from './context';
import { getFileInfo } from 'mol-util/file-info';
import { CifFile, CifFrame } from 'mol-io/reader/cif';
import { mmCIF_Database } from 'mol-io/reader/cif/schema/mmcif';
import { Model, Structure } from 'mol-model/structure';
import { StructureRepresentation } from 'mol-geo/representation/structure';
import { SpacefillProps } from 'mol-geo/representation/structure/representation/spacefill';
import { BallAndStickProps } from 'mol-geo/representation/structure/representation/ball-and-stick';
import { DistanceRestraintProps } from 'mol-geo/representation/structure/representation/distance-restraint';
import { CartoonProps } from 'mol-geo/representation/structure/representation/cartoon';
import { BackboneProps } from 'mol-geo/representation/structure/representation/backbone';
import { CarbohydrateProps } from 'mol-geo/representation/structure/representation/carbohydrate';

const getNextId = idFactory(1)

export interface StateEntity<T, K extends string> {
    id: number
    kind: K
    value: T
}
export namespace StateEntity {
    export function create<T, K extends string>(ctx: StateContext, kind: K, value: T): StateEntity<T, K> {
        const entity = { id: getNextId(), kind, value }
        ctx.entities.add(entity)
        ctx.change.next(ctx.change.getValue() + 1)
        return entity
    }
}

export type AnyEntity = StateEntity<any, any>
export type NullEntity = StateEntity<null, 'null'>

export const NullEntity: NullEntity = { id: -1, kind: 'null', value: null }
export const RootEntity: StateEntity<null, 'root'> = { id: 0, kind: 'root', value: null }

export interface UrlProps {
    url: string
    name: string
    type: string
    getData: () => Promise<string | Uint8Array>
}

export type UrlEntity = StateEntity<UrlProps, 'url'>
export namespace UrlEntity {
    export function ofUrl(ctx: StateContext, url: string, isBinary?: boolean): UrlEntity {
        const { name, ext: type, compressed, binary } = getFileInfo(url)
        return StateEntity.create(ctx, 'url', {
            url, name, type,
            getData: () => readUrl(url, isBinary || !!compressed || binary)
        })
    }
}

export interface FileProps {
    name: string
    type: string
    getData: () => Promise<string | Uint8Array>
}

export type FileEntity = StateEntity<FileProps, 'file'>
export namespace FileEntity {
    export function ofFile(ctx: StateContext, file: File, isBinary?: boolean): FileEntity {
        const { name, ext: type, compressed, binary } = getFileInfo(file)
        return StateEntity.create(ctx, 'file', {
            name, type,
            getData: () => readFile(file, isBinary || !!compressed || binary)
        })
    }
}

export interface DataProps {
    type: string
    data: string | Uint8Array
}

export type DataEntity = StateEntity<DataProps, 'data'>
export namespace DataEntity {
    export function ofData<T>(ctx: StateContext, data: string | Uint8Array, type: string): DataEntity {
        return StateEntity.create(ctx, 'data', {
            type,
            data
        })
    }
}

export type CifEntity = StateEntity<CifFile, 'cif'>
export namespace CifEntity {
    export function ofCifFile(ctx: StateContext, file: CifFile): CifEntity {
        return StateEntity.create(ctx, 'cif', file)
    }
}

export type MmcifEntity = StateEntity<{ db: mmCIF_Database, frame: CifFrame }, 'mmcif'>
export namespace MmcifEntity {
    export function ofMmcifDb(ctx: StateContext, mmCif: { db: mmCIF_Database, frame: CifFrame }): MmcifEntity {
        return StateEntity.create(ctx, 'mmcif', mmCif)
    }
}

export type ModelEntity = StateEntity<ReadonlyArray<Model>, 'model'>
export namespace ModelEntity {
    export function ofModels(ctx: StateContext, models: ReadonlyArray<Model>): ModelEntity {
        return StateEntity.create(ctx, 'model', models)
    }
}

export type StructureEntity = StateEntity<Structure, 'structure'>
export namespace StructureEntity {
    export function ofStructure(ctx: StateContext, structure: Structure): StructureEntity {
        return StateEntity.create(ctx, 'structure', structure)
    }
}

export type SpacefillEntity = StateEntity<StructureRepresentation<SpacefillProps>, 'spacefill'>
export namespace SpacefillEntity {
    export function ofRepr(ctx: StateContext, repr: StructureRepresentation<SpacefillProps>): SpacefillEntity {
        return StateEntity.create(ctx, 'spacefill', repr)
    }
}

export type BallAndStickEntity = StateEntity<StructureRepresentation<BallAndStickProps>, 'ballandstick'>
export namespace BallAndStickEntity {
    export function ofRepr(ctx: StateContext, repr: StructureRepresentation<BallAndStickProps>): BallAndStickEntity {
        return StateEntity.create(ctx, 'ballandstick', repr)
    }
}

export type DistanceRestraintEntity = StateEntity<StructureRepresentation<DistanceRestraintProps>, 'distancerestraint'>
export namespace DistanceRestraintEntity {
    export function ofRepr(ctx: StateContext, repr: StructureRepresentation<DistanceRestraintProps>): DistanceRestraintEntity {
        return StateEntity.create(ctx, 'distancerestraint', repr)
    }
}

export type BackboneEntity = StateEntity<StructureRepresentation<BackboneProps>, 'backbone'>
export namespace BackboneEntity {
    export function ofRepr(ctx: StateContext, repr: StructureRepresentation<BackboneProps>): BackboneEntity {
        return StateEntity.create(ctx, 'backbone', repr)
    }
}

export type CartoonEntity = StateEntity<StructureRepresentation<CartoonProps>, 'cartoon'>
export namespace CartoonEntity {
    export function ofRepr(ctx: StateContext, repr: StructureRepresentation<CartoonProps>): CartoonEntity {
        return StateEntity.create(ctx, 'cartoon', repr)
    }
}

export type CarbohydrateEntity = StateEntity<StructureRepresentation<CarbohydrateProps>, 'carbohydrate'>
export namespace CarbohydrateEntity {
    export function ofRepr(ctx: StateContext, repr: StructureRepresentation<CarbohydrateProps>): CarbohydrateEntity {
        return StateEntity.create(ctx, 'carbohydrate', repr)
    }
}