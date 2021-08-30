import React, { FC, useState, useRef, useCallback } from "react";
import { PanResponder, Dimensions, View } from "react-native";
import Svg, { Path, Circle, G, Text } from "react-native-svg";

import { CircleProps } from "./types/circle.types";

const CircleSlider: FC<CircleProps> = ({
	style,
	min = 0,
	onChange,
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

	const cartesianToPolar = useCallback(
		(x: number, y: number) => {
			const hC = dialRadius + btnRadius;

			if (x === 0) return y > hC ? 0 : 180;
			if (y === 0) return x > hC ? 90 : 270;

			return (
				Math.round((Math.atan((y - hC) / (x - hC)) * 180) / Math.PI) +
				(x > hC ? 90 : 270)
			);
		},
		[dialRadius, btnRadius]
	);

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (e, gs) => true,
			onStartShouldSetPanResponder: (e, gs) => true,
			onMoveShouldSetPanResponderCapture: (e, gs) => true,
			onStartShouldSetPanResponderCapture: (e, gs) => true,
			onPanResponderMove: (e, gs) => {
				const xOrigin = xCenter - (dialRadius + btnRadius);
				const yOrigin = yCenter - (dialRadius + btnRadius);
				const result = cartesianToPolar(gs.moveX - xOrigin, gs.moveY - yOrigin);

				if (result <= min) {
					setAngle(min);
					onChange(min);
				}
				if (result >= max) {
					setAngle(max);
					onChange(max);
				}

				setAngle(result);
				onChange(result);
			},
		})
	).current;

	const polarToCartesian = useCallback(
		(angle: number) => {
			const raio = dialRadius;
			const hC = dialRadius + btnRadius;
			const result = ((angle - 90) * Math.PI) / 180.0;

			const x = hC + raio * Math.cos(result);
			const y = hC + raio * Math.sin(result);
			return { x, y };
		},
		[dialRadius, btnRadius]
	);

	const startCoord = polarToCartesian(0);
	const endCoord = polarToCartesian(angle);
	const width = (dialRadius + btnRadius) * 2;

	return (
		<View style={style}>
			<Svg width={width} height={width}>
				<Path
					fill="none"
					stroke={meterColor}
					strokeWidth={dialWidth}
					d={`M${startCoord.x} ${startCoord.y} A ${dialRadius} ${dialRadius} 0 ${angle > 180 ? 1 : 0} 1 ${endCoord.x} ${endCoord.y}`}
				/>
				<Circle
					r={dialRadius}
					cx={width / 2}
					cy={width / 2}
					fill={fillColor}
					stroke={strokeColor}
					strokeWidth={strokeWidth}
				/>
				<G x={endCoord.x - btnRadius} y={endCoord.y - btnRadius}>
					<Circle
						r={btnRadius}
						cx={btnRadius}
						cy={btnRadius}
						fill={meterColor}
						{...panResponder.panHandlers}
					/>
					{
						textSize > 0 && (
							<Text
								x={btnRadius}
								fill={textColor}
								fontSize={textSize}
								textAnchor="middle"
								y={btnRadius + textSize / 2}
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
