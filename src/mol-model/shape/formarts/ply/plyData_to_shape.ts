import {ply_form} from '../../../../mol-io/reader/ply/parse_data/data-model';
import {MyData} from '../../../../../build/src/mol-model/shape/formarts/ply/plyData_to_shape';
import {Progress, RuntimeContext} from 'mol-task';
import {Mesh} from '../../../../mol-geo/geometry/mesh/mesh';
import {MeshBuilder} from '../../../../mol-geo/geometry/mesh/mesh-builder';
import {Mat4, Vec3} from '../../../../mol-math/linear-algebra/3d';
import {Sphere} from '../../../../mol-geo/primitive/sphere';
import {Shape} from '../../shape';
import {Color} from '../../../../mol-util/color';
import {Canvas3D} from '../../../../mol-canvas3d/canvas3d';
import {labelFirst} from '../../../../mol-theme/label';
import {ColorNames} from '../../../../mol-util/color/tables';
import {ShapeRepresentation} from '../../../../mol-repr/shape/representation';


const parent = document.getElementById('app')!
parent.style.width = '100%'
parent.style.height = '100%'

const canvas = document.createElement('canvas')
canvas.style.width = '100%'
canvas.style.height = '100%'
parent.appendChild(canvas)

const info = document.createElement('div')
info.style.position = 'absolute'
info.style.fontFamily = 'sans-serif'
info.style.fontSize = '24pt'
info.style.bottom = '20px'
info.style.right = '20px'
info.style.color = 'white'
parent.appendChild(info)

const canvas3d = Canvas3D.create(canvas, parent)
canvas3d.animate()
canvas3d.input.move.subscribe(async ({x, y}) => {
    const pickingId = await canvas3d.identify(x, y)
    let label = ''
    if (pickingId) {
        const { loci } = canvas3d.getLoci(pickingId)
        label = labelFirst(loci)
    }
    info.innerText = label
})




export interface MyData {
    centers: number[],
    colors: string[],
    labels: string[],
    transforms: number[]
}

let data:MyData = {
    centers: [],
    colors: [],
    labels: [],
    transforms:[]
}


function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

 function collectData_for_Shape(parsedData: ply_form):{centers: number[], colors: string[], labels: string[], transforms: number[]}{
    // parsedData.data.PLY_File. to access So.format.Ply

    data.centers = parsedData.vertices;
    let hexColor;

    for(let i=0; i<parsedData.vertexCount; i++){
        hexColor = rgbToHex(parsedData.colors[i*3+0],parsedData.colors[i*3+1],parsedData.colors[i*3+2]);
        data.colors[i] = hexColor;
        data.labels[i] = '';
        data.transforms[i] = 0;
    }
    console.log(data);
    return data;
}




 async function getSphereMesh(ctx: RuntimeContext, centers: number[], mesh?: Mesh) {
    const builderState = MeshBuilder.createState(centers.length * 128, centers.length * 128 / 2, mesh)
    const t = Mat4.identity()
    const v = Vec3.zero()
    const sphere = Sphere(4)
    builderState.currentGroup = 0
    for (let i = 0, il = centers.length / 3; i < il; ++i) {
        // for production, calls to update should be guarded by `if (ctx.shouldUpdate)`
        await ctx.update({ current: i, max: il, message: `adding sphere ${i}` })
        builderState.currentGroup = i
        Mat4.setTranslation(t, Vec3.fromArray(v, centers, i * 3))
        MeshBuilder.addPrimitive(builderState, t, sphere)
    }
    let a = MeshBuilder.getMesh(builderState);
    //console.log(a);
    return a
}


export async function getShape(ctx: RuntimeContext, parsedData: ply_form, props: {}, shape?: Shape<Mesh>) {
    let data:MyData;
    data = collectData_for_Shape(parsedData)
    await ctx.update('async creation of shape from  myData')
    const { centers , colors, labels} = data
    const mesh = await getSphereMesh(ctx, centers, shape && shape.geometry)
    const groupCount = centers.length / 3
    return shape || Shape.create(
        'test', mesh,
        (groupId: number) => Color(Number(colors[groupId])), // color: per group, same for instances
        () => 1, // size: constant
        (groupId: number, instanceId: number) => labels[instanceId * groupCount + groupId] // label: per group and instance
    )
}

const repr = ShapeRepresentation(getShape, Mesh.Utils)

export async function init_ren(myData : ply_form) {
    // Create shape from myData and add to canvas3d
    await repr.createOrUpdate({}, myData).run((p: Progress) => console.log(Progress.format(p)))
    canvas3d.add(repr)
    canvas3d.resetCamera()

    // Change color after 1s
    setTimeout(async () => {
        myData.colors[0] = ColorNames.darkmagenta
        // Calling `createOrUpdate` with `data` will trigger color and transform update
        await repr.createOrUpdate({}, myData).run()
    }, 1000)
}



