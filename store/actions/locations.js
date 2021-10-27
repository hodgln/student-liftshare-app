export const ORIGIN_CLICKED = 'ORIGIN_CLICKED'

export const DESTINATION_CLICKED = 'DESTINATION_CLICKED'

export const HOME_CLICKED = 'HOME_CLICKED'

export const ORIGINNAME_CLICKED = 'ORIGINNAME_CLICKED'

export const DESTINATIONNAME_CLICKED = 'DESTINATIONNAME_CLICKED'

export const DISTANCE_BETWEEN = 'DISTANCE_BETWEEN'



export const originClicked = (origin) => {
    return({ type: ORIGIN_CLICKED, origin: origin })
}

export const destinationClicked = (destination) => {
    return ({ type: DESTINATION_CLICKED, destination: destination })
}

export const homeClicked = () => {
    return({ type: HOME_CLICKED })
}

export const originNameClicked = (originName) => {
    return ({ type: ORIGINNAME_CLICKED, originName: originName})
}

export const destinationNameClicked = (destinationName) => {
    return ({ type: DESTINATIONNAME_CLICKED, destinationName: destinationName})
}

export const distanceBetween = (distance) => {
    return({ type: DISTANCE_BETWEEN, distance: distance})
}
