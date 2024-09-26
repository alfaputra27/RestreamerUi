import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

import Logo from './logos/kick.svg';
import FormInlineButton from '../../../misc/FormInlineButton';

const id = 'kick';
const name = 'Kick';
const version = '1.0';
const stream_key_link = 'https://kick.com/dashboard/settings/stream';
const description = (
	<Trans>
		Transmit your Livestream to an Kick.com RTMP service.{' '}
		<Link color="secondary" target="_blank" href="https://help.kick.com/en/articles/7066931-how-to-stream-on-kick-com">
			Here{' '}
		</Link>
		you can find more details about the settings.
	</Trans>
);
const image_copyright = <Trans>Please get in touch with the operator of the service and check what happens.</Trans>;
const author = {
	creator: {
		name: 'datarhei',
		link: 'https://github.com/datarhei',
	},
	maintainer: {
		name: 'datarhei',
		link: 'https://github.com/datarhei',
	},
};
const category = 'platform';
const requires = {
	protocols: ['rtmps'],
	formats: ['flv'],
	codecs: {
		audio: ['aac', 'mp3'],
		video: ['h264'],
	},
};

function ServiceIcon(props) {
	return <img src={Logo} alt="Kick.com Logo" {...props} />;
}

function init(settings) {
	const initSettings = {
		server_url: '',
		stream_key: '',
		...settings,
	};

	return initSettings;
}

function Service({ settings = {}, skills = {}, metadata = {}, streams = [], onChange = function (output, settings) {} }) {
	settings = init(settings);

	const handleChange = (what) => (event) => {
		const value = event.target.value;

		settings[what] = value;

		const output = createOutput(settings);

		onChange([output], settings);
	};

	const createOutput = (settings) => {
		const output = {
			address: settings.server_url,
			options: ['-rtmp_playpath', settings.stream_key, '-f', 'flv'],
		};

		return output;
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<TextField
					variant="outlined"
					fullWidth
					placeholder="rtmps://your-id.global-contribute.live-video.net"
					label={<Trans>Server URL</Trans>}
					value={settings.server_url}
					onChange={handleChange('server_url')}
					error={settings.server_url.includes('rtmps://') ? false : true}
					helperText={settings.server_url.includes('rtmps://') ? false : 'Please enter a valid RTMPS URL.'}
				/>
			</Grid>
			<Grid item xs={12} md={9}>
				<TextField
					variant="outlined"
					fullWidth
					placeholder="abc123"
					label={<Trans>Stream key</Trans>}
					value={settings.stream_key}
					onChange={handleChange('stream_key')}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<FormInlineButton target="blank" href={stream_key_link} component="a">
					<Trans>GET</Trans>
				</FormInlineButton>
			</Grid>
		</Grid>
	);
}

export { id, name, version, stream_key_link, description, image_copyright, author, category, requires, ServiceIcon as icon, Service as component };
