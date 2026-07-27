import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/network-simulator.js',
                'resources/js/pwa-offline-tester.js',
                'resources/js/test-automation-runner.js',
            ],
            refresh: true,
        }),
    ],
});
