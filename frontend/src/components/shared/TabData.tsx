/* eslint-disable semi */

// I don't know why the above is doing this but it' scomplaining about it on the last line

import React from 'react';

export default interface TabData {
    label: string;
    // this would typically be a ReactIcon of some type.
    icon?: React.ReactNode;
}
