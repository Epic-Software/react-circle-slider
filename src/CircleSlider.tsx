import React, { FC, useState, useRef, useCallback } from "react";
import { PanResponder, Dimensions, View } from "react-native";
import Svg, { Path, Circle, G, Text } from "react-native-svg";

import { CircleProps } from "./types/circle.types";

const CircleSlider: FC<CircleProps> = ({
	style,
	min = 0,
	value = 0,
	max = 359,
	dialWidth = 5,
	textSize = 10,
	btnRadius = 15,
	dialRadius = 130,
	strokeWidth = 0.5,
	textColor = "#fff",
	fillColor = "none",
	meterColor = "#0cd",
	strokeColor = "#fff",
	xCenter = Dimensions.get("window").width / 2,
	yCenter = Dimensions.get("window").height / 2,
}: CircleProps) => {
	const [angle, setAngle] = useState(value);

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (e, gs) => true,
			onStartShouldSetPanResponder: (e, gs) => true,
			onMoveShouldSetPanResponderCapture: (e, gs) => true,
			onStartShouldSetPanResponderCapture: (e, gs) => true,
			onPanResponderMove: (e, gs) => {
				let xOrigin = xCenter - (dialRadius + btnRadius);
				let yOrigin = yCenter - (dialRadius + btnRadius);
				let a = cartesianToPolar(gs.moveX - xOrigin, gs.moveY - yOrigin);

				if (a <= min) setAngle(min);
				if (a >= max) setAngle(max);

				setAngle(a);
			},
		})
	).current;

	const polarToCartesian = useCallback(
		(angle: number) => {
			let r = dialRadius;
			let hC = dialRadius + btnRadius;
			let a = ((angle - 90) * Math.PI) / 180.0;

			let x = hC + r * Math.cos(a);
			let y = hC + r * Math.sin(a);
			return { x, y };
		},
		[dialRadius, btnRadius]
	);

	const cartesianToPolar = useCallback(
		(x: number, y: number) => {
			let hC = dialRadius + btnRadius;

			if (x === 0) return y > hC ? 0 : 180;
			if (y === 0) return x > hC ? 90 : 270;

			return (
				Math.round((Math.atan((y - hC) / (x - hC)) * 180) / Math.PI) +
				(x > hC ? 90 : 270)
			);
		},
		[dialRadius, btnRadius]
	);

	const bR = btnRadius;
	const dR = dialRadius;
	const startCoord = polarToCartesian(0);
	var endCoord = polarToCartesian(angle);
	const width = (dialRadius + btnRadius) * 2;

	return (
		<View style={style}>
			<Svg width={width} height={width}>
				<Path
					fill="none"
					stroke={meterColor}
					strokeWidth={dialWidth}
					d={`M${startCoord.x} ${startCoord.y} A ${dR} ${dR} 0 ${angle > 180 ? 1 : 0} 1 ${endCoord.x} ${endCoord.y}`}
				/>
				<Circle
					r={dR}
					cx={width / 2}
					cy={width / 2}
					fill={fillColor}
					stroke={strokeColor}
					strokeWidth={strokeWidth}
				/>
				<G x={endCoord.x - bR} y={endCoord.y - bR}>
					<Circle
						r={bR}
						cx={bR}
						cy={bR}
						fill={meterColor}
						{...panResponder.panHandlers}
					/>
					{
						textSize > 0 && (
							<Text
								x={bR}
								fill={textColor}
								fontSize={textSize}
								textAnchor="middle"
								y={bR + textSize / 2}
							>
								{angle || ""}
							</Text>
						)
					}
				</G>
			</Svg>
		</View>
	);
};

export default React.memo(CircleSlider);
