import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import makeStyles from '@mui/styles/makeStyles';
import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Services from '../Publication/Services';

const useStyles = makeStyles((theme) => ({
	egressBar: {
		marginTop: '-.4em',
		marginBottom: '-.2em',
		'& .svg-inline--fa': {
			width: '1.4em',
			height: '1.4em',
		},
		'& .egress-icon': {
			height: '1.4em',
			paddingButton: '.1em',
		},
		'& .egress-left': {
			minHeight: 24,
			minWidth: 30,
			marginRight: 6,
			float: 'left',
			'& img': {
				maxWidth: 22,
				maxHeight: 22,
				marginBottom: '0!important',
			},
		},
		'& .egress-right-edit': {
			float: 'right',
			marginLeft: 5,
			marginTop: 2,
		},
		'& .egress-right-switch': {
			float: 'right',
			marginLeft: 5,
		},
		'& .egress-name': {
			float: 'left',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			maxWidth: '100%',
			fontSize: '.9rem',
		},
		'& .player-icon': {
			color: theme.palette.secondary.main,
			fontSize: '1.5rem',
		},
	},
	tableContainer: {
		width: '100%',
		overflowX: 'auto',
		marginTop: '20px',
	},
	table: {
		width: '100%',
		maxWidth: '100%',
		tableLayout: 'fixed',
		borderCollapse: 'collapse',
	},
	tableCell: {
		border: '1px solid black',
		padding: '8px',
		fontSize: '0.9rem',
		wordWrap: 'break-word',
	},
	tableHeader: {
		backgroundColor: theme.palette.grey[200],
	},
}));

export default function Egress(props) {
	const classes = useStyles();
	const [$order, setOrder] = React.useState('stop');

	React.useEffect(() => {
		(async () => {
			await update();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const update = async () => {
		setOrder(props.order);
	};

	const handleSwitch = async (event) => {
		const checked = event.target.checked;

		const order = checked === true ? 'start' : 'stop';

		setOrder(order);

		let onOrder = order;
		if (order === 'start' && $order === 'start') {
			onOrder = 'restart';
		}

		const res = await props.onOrder(onOrder);

		if (res === false) {
			setOrder(order === 'start' ? 'stop' : 'start');
		}
	};

	let name = <Trans>Unknown</Trans>;
	let icon = <DeviceUnknownIcon />;

	if (props.service === 'player') {
		name = <Trans>Player</Trans>;
		icon = <OndemandVideoIcon className="player-icon" />;
	} else {
		let s = Services.Get(props.service);
		if (s !== null) {
			const Icon = s.icon;

			name = s.name;
			if (props.name && props.name.length !== 0) {
				name = props.name;
			}

			icon = <Icon />;
		}
	}

	let checked = props.order === 'start' ? true : false;
	if (props.reconnect === false) {
		if (props.state === 'error' || props.state === 'disconnected') {
			checked = false;
		}
	}

	let color = 'secondary';
	switch (props.state) {
		case 'disconnecting':
		case 'connecting':
			color = 'warning';
			break;
		case 'error':
		case 'disconnected':
			color = 'error';
			break;
		default:
			color = 'secondary';
			break;
	}

	return (
		<Grid container className={classes.egressBar}>
			<Grid item xs={12}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
					<Stack className="egress-left" direction="row" alignItems="center" spacing={0}>
						<IconButton size="small" className="egress-left">
							{icon}
						</IconButton>
						<Typography className="egress-name">{name}</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={0}>
						{props.service !== 'player' && (
							<Switch
								checked={checked}
								disabled={props.order !== $order}
								onChange={handleSwitch}
								color={color}
								size="small"
								className="egress-right-switch"
							/>
						)}
						<IconButton size="small" className="egress-right-edit" onClick={props.onEdit}>
							<EditIcon />
						</IconButton>
					</Stack>
				</Stack>
			</Grid>

			{/* Tabel horizontal untuk informasi tambahan ketika service youtube */}
			{props.service === 'youtube' && (
				<Grid item xs={12} className={classes.tableContainer}>
					<table className={classes.table}>
						<tbody>
							<tr>
								<td className={classes.tableCell}><strong>Jadwal Mulai</strong></td>
								<td className={classes.tableCell}>11/11/24</td>
							</tr>
							<tr>
								<td className={classes.tableCell}><strong>Jadwal Selesai</strong></td>
								<td className={classes.tableCell}>12/11/24</td>
							</tr>
							<tr>
								<td className={classes.tableCell}><strong>Content AI</strong></td>
								<td className={classes.tableCell}>YA</td>
							</tr>
							<tr>
								<td className={classes.tableCell}><strong>Repeating</strong></td>
								<td className={classes.tableCell}>1 JAM</td>
							</tr>
						</tbody>
					</table>
				</Grid>
			)}
		</Grid>
	);
}

Egress.defaultProps = {
	service: '',
	name: '',
	state: 'disconnected',
	order: 'stop',
	reconnect: true,
	onEdit: function () {},
	onOrder: function (order) {},
};
