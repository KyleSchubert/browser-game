/* Diagram of zoneConnections:
portal_1        portal_4
portal_2        portal_5
portal_3        portal_6
*/

var zoneConnections = {
    1: {'portal_6': 2},
    2: {'portal_3': 1, 'portal_5': 3}
};

var zoneMobs = {
    1: ['tino'],
    2: ['tino']
};

//TODO: move everything out of the way of the play area and make it bigger
//      Also, put the stats area horizontal below the play area
