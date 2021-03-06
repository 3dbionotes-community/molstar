/**
 * Copyright (c) 2019 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { PluginContext } from '../../../mol-plugin/context';
import { State, StateBuilder } from '../../../mol-state';
import { Task } from '../../../mol-task';
import { FileInfo } from '../../../mol-util/file-info';
import { PluginStateObject } from '../objects';
import { StateTransforms } from '../transforms';
import { DataFormatProvider, DataFormatBuilderOptions } from './data-format';

export const PlyProvider: DataFormatProvider<any> = {
    label: 'PLY',
    description: 'PLY',
    stringExtensions: ['ply'],
    binaryExtensions: [],
    isApplicable: (info: FileInfo, data: string) => {
        return info.ext === 'ply'
    },
    getDefaultBuilder: (ctx: PluginContext, data: StateBuilder.To<PluginStateObject.Data.String>, options: DataFormatBuilderOptions, state: State) => {
        return Task.create('PLY default builder', async taskCtx => {
            let tree: StateBuilder.To<any> = data.apply(StateTransforms.Data.ParsePly)
                .apply(StateTransforms.Model.ShapeFromPly)
            if (options.visuals) {
                tree = tree.apply(StateTransforms.Representation.ShapeRepresentation3D)
            }
            await state.updateTree(tree).runInContext(taskCtx)
        })
    }
}