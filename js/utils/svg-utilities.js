const SvgUtilities = {}

SvgUtilities.createSVG = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null, 'width', '600');
    svg.setAttributeNS(null, 'height', '600');
    svg.setAttributeNS(null, 'class', 'svg-clock');
    svg.setAttributeNS(null, 'viewBox', '0 0 150 150');

    return svg;
}

/**
 * timer
 */
SvgUtilities.createSvgG = (transform, id, withTransition) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    if (transform) {
        g.setAttributeNS(null, 'transform', transform);
    }
    if (id) {
        g.setAttributeNS(null, "id", id);
    }
    if (withTransition) {
        g.setAttributeNS(null, "style", "transition: all 1s linear");
    }
    return g;
}


SvgUtilities.createSvgCircle = (r, cx, cy, className) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circle.setAttributeNS(null, 'r', r);
    if (cx) {
        circle.setAttributeNS(null, 'cx', cx);
    }
    if (cy) {
        circle.setAttributeNS(null, 'cy', cy);
    }
    if (className) {
        circle.setAttributeNS(null, "class", className);
    }
    return circle;
}

/**
 * alarm 
 */
SvgUtilities.createSvgPath = (className, transform, d) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    if(className) {
        path.setAttributeNS(null, "class", className);
    }
    if(transform) {
        path.setAttributeNS(null, "transform", transform);
    }
    if(d) {
        path.setAttributeNS(null, "d", d);
    }
    return path;
}