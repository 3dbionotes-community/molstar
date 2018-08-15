/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * Adapted from LiteMol
 * Copyright (c) 2016 - now David Sehnal, licensed under Apache 2.0, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import * as React from 'react'

import { View } from '../view';
import { Controller } from '../../controller/controller';
import { TransformListController } from '../../controller/transform/list';
import { AnyTransform } from 'mol-view/state/transform';
import { Spacefill } from './spacefill';
import { BallAndStick } from './ball-and-stick';
import { AnyEntity } from 'mol-view/state/entity';
import { FileLoader } from './file-loader';
import { ModelToStructure } from './model';
import { StructureCenter } from './structure';
import { Cartoon } from './cartoon';
import { DistanceRestraint } from './distance-restraint';
import { Backbone } from './backbone';
import { UrlLoader } from './url-loader';
import { Carbohydrate } from './carbohydrate';

function getTransformComponent(controller: TransformListController, entity: AnyEntity, transform: AnyTransform) {
    switch (transform.kind) {
        case 'url-to-spacefill':
            return <UrlLoader controller={controller} ctx={controller.context.stage.ctx}></UrlLoader>
        case 'file-to-spacefill':
            return <FileLoader controller={controller} ctx={controller.context.stage.ctx}></FileLoader>
        case 'model-to-structure':
            return <ModelToStructure controller={controller} entity={entity} transform={transform} ctx={controller.context.stage.ctx}></ModelToStructure>
        case 'structure-center':
            return <StructureCenter controller={controller} entity={entity} transform={transform} ctx={controller.context.stage.ctx}></StructureCenter>
        case 'spacefill-update':
            return <Spacefill controller={controller} entity={entity} transform={transform} ctx={controller.context.stage.ctx}></Spacefill>
        case 'ballandstick-update':
            return <BallAndStick controller={controller} entity={entity} transform={transform} ctx={controller.context.stage.ctx}></BallAndStick>
        case 'distancerestraint-update':
            return <DistanceRestraint controller={controller} entity={entity} transform={transform} ctx={controller.context.stage.ctx}></DistanceRestraint>
        case 'backbone-update':
            return <Backbone controller={controller} entity={entity} transform={transform} ctx={controller.context.stage.ctx}></Backbone>
        case 'cartoon-update':
            return <Cartoon controller={controller} entity={entity} transform={transform} ctx={controller.context.stage.ctx}></Cartoon>
        case 'carbohydrate-update':
            return <Carbohydrate controller={controller} entity={entity} transform={transform} ctx={controller.context.stage.ctx}></Carbohydrate>
    }
    return <Transform controller={controller} entity={entity} transform={transform}></Transform>
}

export class Transform extends View<Controller<any>, {}, { transform: AnyTransform, entity: AnyEntity }> {
    render() {
        const { transform, entity } = this.props

        return <div className='molstar-transformer-wrapper'>
            <div className='molstar-panel molstar-control molstar-transformer'>
                <div className='molstar-panel-header'>
                    <button
                        className='molstar-btn molstar-btn-link molstar-panel-expander'
                        onClick={(e)=> {
                            console.log(transform, entity)
                        }}
                    >
                        <span>[{transform.kind}] {transform.inputKind} -> {transform.outputKind}</span>
                    </button>
                </div>
            </div>
        </div>;
    }
}

export class TransformList extends View<TransformListController, {}, {}> {
    render() {
        const transforms: JSX.Element[] = []
        const state = this.controller.state.getValue()
        if (state && state.entity) {
            const entity = state.entity
            if (entity) {
                state.transforms.forEach(t => {
                    transforms.push(
                        <div
                            key={`${t.inputKind}|${t.outputKind}`}
                            children={getTransformComponent(this.controller, entity, t)}
                        />
                    )
                })
            }
        }

        return <div className='molstar-transform-view' children={transforms} />;
    }
}