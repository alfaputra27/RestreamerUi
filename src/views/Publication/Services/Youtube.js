import React, { useState } from 'react';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Checkbox from '../../../misc/Checkbox';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link'; // Import Link from Material-UI

const id = 'youtube';
const name = 'YouTube Live';
const version = '1.1';
const stream_key_link = 'https://www.youtube.com/live_dashboard';
const description = (
    <Trans>
        Pilih channel untuk menargetkan live. Setting judul, deskripsi, tag, dll..{' '}
        <Link color="secondary" target="_blank" href="https://creatoracademy.youtube.com/">
            Creator Academy
        </Link>
        .
    </Trans>
);

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
    protocols: ['rtmps', 'https'],
    formats: ['flv', 'hls'],
    codecs: {
        audio: ['aac', 'mp3'],
        video: ['h264', 'hevc', 'av1'],
    },
};

function ServiceIcon(props) {
    return <FontAwesomeIcon icon={faYoutube} style={{ color: '#FF0000' }} {...props} />;
}

function init(settings) {
    const initSettings = {
        mode: 'rtmps',
        stream_key: '',
        primary: true,
        backup: false,
        ...settings,
    };

    return initSettings;
}

function Service(props) {
    const settings = init(props.settings);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [isLive, setIsLive] = useState(false);
    const [onOffStatus, setOnOffStatus] = useState('off'); // State for Repeating On/Off menu
	const [onOffStatusai, setOnOffStatusai] = useState('tidak'); // State for AI Content menu
    const [onOffStatusvisible, setOnOffStatusaivisible] = useState('publik'); // State for AI Content menu
	const [selectedMinutes, setSelectedMinutes] = useState(1); // State for minutes dropdown
	const [scheduleEnabled, setScheduleEnabled] = useState(false); // State for checkbox controlling schedule

    const handleChange = (what) => (event) => {
        const value = event.target.value;

        if (['primary', 'backup'].includes(what)) {
            settings[what] = !settings[what];
        } else {
            settings[what] = value;
        }

        const outputs = createOutput(settings);
        props.onChange(outputs, settings);
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file)); // Generate preview URL
    };

    const createOutput = (settings) => {
        const outputs = [];

        if (settings.stream_key.length === 0) {
            return outputs;
        }

        if (settings.mode === 'rtmps') {
            let options = ['-f', 'flv'];
            if (settings.primary) {
                outputs.push({
                    address: 'rtmps://a.rtmp.youtube.com/live2/' + settings.stream_key,
                    options: options.slice(),
                });
            }

            if (settings.backup) {
                outputs.push({
                    address: 'rtmps://b.rtmp.youtube.com/live2?backup=1/' + settings.stream_key,
                    options: options.slice(),
                });
            }
        }
        return outputs;
    };

    return (
        <Grid container spacing={2}>
            {/* Channel selection */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Pilih Channel</InputLabel>
                    <Select value={settings.mode} onChange={handleChange('mode')}>
                        <MenuItem value="rtmps">Channel A</MenuItem>
                        <MenuItem value="hls">Channel B</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
            <FormControl fullWidth>
            <InputLabel>Pilih Stream Key</InputLabel>
            <Select value={settings.stream_key} onChange={handleChange('stream_key')}>
            <MenuItem value="stream_key">StreamKey A</MenuItem>
            <MenuItem value="stream_key">StreamKey B</MenuItem>
            <MenuItem value="stream_key">Buat Otomatis</MenuItem>
				{/* <TextField variant="outlined" fullWidth label={<Trans>Stream key</Trans>} value={settings.stream_key} onChange={handleChange('stream_key')} /> */}
                </Select>
                </FormControl>
            </Grid>

            {/* Title, Description, Tags */}
            <Grid item xs={12}>
                <TextField
                    label="Judul"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Deskripsi"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Tag (pisahkan dengan koma)"
                    variant="outlined"
                    fullWidth
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </Grid>

            {/* AI Content Selector */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Content AI</InputLabel>
                    <Select value={onOffStatusai} onChange={(e) => setOnOffStatusai(e.target.value)}>
                        <MenuItem value="on">YA</MenuItem>
                        <MenuItem value="tidak">Tidak</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Visible</InputLabel>
                    <Select value={onOffStatusvisible} onChange={(e) => setOnOffStatusaivisible(e.target.value)}>
                        <MenuItem value="publik">Publik</MenuItem>
                        <MenuItem value="privat">Private</MenuItem>
                        <MenuItem value="tidakpublik">Tidak Publik</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Thumbnail Upload */}
            <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                    Upload Thumbnail
                    <input type="file" hidden onChange={handleThumbnailUpload} />
                </Button>
                {thumbnailPreview && (
                    <img
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        style={{ width: '100%', height: 'auto', marginTop: '10px' }}
                    />
                )}
            </Grid>

            {/* Repeating and Menit Dropdown */}
            <Grid container spacing={2} item xs={12}>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Repeating</InputLabel>
                        <Select
                            value={onOffStatus}
                            label="Repeating"
                            onChange={(e) => setOnOffStatus(e.target.value)}
                        >
                            <MenuItem value="on">On</MenuItem>
                            <MenuItem value="off">Off</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth disabled={onOffStatus === 'off'}>
                        <InputLabel>Menit</InputLabel>
                        <Select
                            value={selectedMinutes}
                            onChange={(e) => setSelectedMinutes(e.target.value)}
                        >
                            <MenuItem value={1}>1 Menit</MenuItem>
                            <MenuItem value={2}>5 Menit</MenuItem>
                            <MenuItem value={3}>1 Jam</MenuItem>
                            <MenuItem value={4}>5 Jam</MenuItem>
                            <MenuItem value={5}>24 Jam</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Checkbox to enable/disable Schedule */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <Checkbox
                        checked={scheduleEnabled}
                        onChange={(e) => setScheduleEnabled(e.target.checked)}
                        label="Enable Schedule"
                    />
                </FormControl>
            </Grid>

            {/* Start and Stop Schedule */}
            <Grid container spacing={2} item xs={12}>
                <Grid item xs={6}>
                    <TextField
                        label="Set Start Schedule"
                        type="datetime-local"
                        fullWidth
                        disabled={!scheduleEnabled} // Disable based on checkbox state
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Set Stop Schedule"
                        type="datetime-local"
                        fullWidth
                        disabled={!scheduleEnabled} // Disable based on checkbox state
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
            </Grid>

			

        </Grid>
    );
}

Service.defaultProps = {
    settings: {},
    skills: {},
    metadata: {},
    streams: [],
    onChange: function (output, settings) {},
};

export { id, name, version, stream_key_link, description, author, category, requires, ServiceIcon as icon, Service as component };
