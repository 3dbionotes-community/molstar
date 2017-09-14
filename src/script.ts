/*
 * Copyright (c) 2017 molio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

// import * as util from 'util'
import * as fs from 'fs'

import { parse, GroCategories, GroAtomBasicColumns } from './reader/gro'
import { Category } from './relational/category'

const file = '1crn.gro'
// const file = 'water.gro'
// const file = 'test.gro'
// const file = 'md_1u19_trj.gro'

function getFloatArray(category: Category, name: string) {
    const column = category.getColumn(name)
    const n = category.rowCount
    const array = new Float32Array(n)
    for (let i = 0; i < n; ++i) {
        array[i] = column.getFloat(i)
    }
    return array
}

function getIntArray(category: Category, name: string) {
    const column = category.getColumn(name)
    const n = category.rowCount
    const array = new Int32Array(n)
    for (let i = 0; i < n; ++i) {
        array[i] = column.getInteger(i)
    }
    return array
}

fs.readFile(`./examples/${file}`, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    // console.log(data);

    console.time('parse')
    const parsed = parse(data)
    console.timeEnd('parse')
    if (parsed.isError) {
        console.log(parsed)
    } else {
        const groFile = parsed.result
        const categories = groFile.blocks[0].getCategoriesFromSchema(GroCategories)

        // const header = groFile.blocks[0].getCategory('header')
        const header = categories.header
        if (header) {
            console.log(header.columnNames)

            console.log('title', header.getColumn('title').getString(0))
            console.log('timeInPs', header.getColumn('timeInPs').getFloat(0))
            console.log('numberOfAtoms', header.getColumn('numberOfAtoms').getInteger(0))
            console.log('boxX', header.getColumn('boxX').getFloat(0))
            console.log('boxY', header.getColumn('boxY').getFloat(0))
            console.log('boxZ', header.getColumn('boxZ').getFloat(0))
        } else {
            console.error('no header')
        }

        const atoms = categories.atoms
        if (atoms) {
            console.log(atoms.columnNames)

            const columns = atoms.getColumnsFromSchema(GroAtomBasicColumns)

            console.log(`'${columns.residueNumber.getString(1)}'`)
            console.log(`'${columns.residueName.getString(1)}'`)
            console.log(`'${columns.atomName.getString(1)}'`)
            console.log(columns.z.getFloat(1))
            console.log(`'${columns.z.getString(1)}'`)

            const n = atoms.rowCount
            console.log('rowCount', n)

            console.time('getFloatArray x')
            const x = getFloatArray(atoms, 'x')
            console.timeEnd('getFloatArray x')
            console.log(x.length, x[0], x[x.length-1])

            console.time('getFloatArray y')
            const y = getFloatArray(atoms, 'y')
            console.timeEnd('getFloatArray y')
            console.log(y.length, y[0], y[y.length-1])

            console.time('getFloatArray z')
            const z = getFloatArray(atoms, 'z')
            console.timeEnd('getFloatArray z')
            console.log(z.length, z[0], z[z.length-1])

            console.time('getIntArray residueNumber')
            const residueNumber = getIntArray(atoms, 'residueNumber')
            console.timeEnd('getIntArray residueNumber')
            console.log(residueNumber.length, residueNumber[0], residueNumber[residueNumber.length-1])
        } else {
            console.error('no atoms')
        }
    }
});
