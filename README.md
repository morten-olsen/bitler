**WARNING:** below is an LLM generated placeholder

# Bitler: Your Digital Butler for AI Agents

Bitler is a platform designed to streamline the creation and interaction with AI agents. It provides a modular system for developers to build, extend, and integrate capabilities into AI-driven workflows. Whether you're looking to leverage prebuilt tools or customize your own, Bitler makes it easy to create intelligent systems tailored to your needs.

---

## Features

### Core Entities

Bitler revolves around four main entities:

- **Capabilities**: Single-task tools that can be invoked through Bitler's API or used by agents/dialogs to execute tasks based on prompts.
- **Events**: System-wide, ephemeral notifications that allow capabilities and integrations to react to changes within Bitler in real time.
- **Context Items**: Temporary pieces of shared state information that persist through conversations or prompts, enabling continuity between interactions.
- **Configs**: Configurations that enable capabilities and define their behavior, making the system adaptable to different use cases.

All of these are customizable, and new one can be installed through NPM or build custom to the specific Bitler instance

### User Interface

Bitler includes a built-in UI to:
- Start and resume conversations.
- Explore and interact with available capabilities.
- Subscribe to events and monitor their outputs.

---

## Getting Started

### Prerequisites

- Docker installed on your system.

### Running Bitler

To start Bitler locally using the prebuilt Docker container, run the following command:

```bash
docker run -p 3000:3000 ghcr.io/morten-olsen/bitler
```

> **Note**: This is an early version of Bitler and currently lacks any built-in security measures. Avoid exposing it to untrusted environments.

---

## Overview of Bitler's API

Bitler exposes its functionality through a developer-friendly API, allowing seamless integration into your systems. Key endpoints include:

- **Capabilities**: Execute tasks and query available capabilities.
- **Events**: Subscribe to system-wide events and react to changes in real time.

Documentation for the API will be expanded in future updates.

---

## Development

Coming later

## Contributing

We welcome contributions from the community! If you'd like to contribute:
1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request with a clear description of your changes.

---

