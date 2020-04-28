# Architecture Overview

<img src="images/gradle-tasks-architecture.svg" />

The extension uses client/server architecture using [gRPC](https://grpc.io/) as the interface between the client and server. It uses TypeScript (Node.js) on the client and Java on the server.

On extension activate, the client starts the Java gRPC server which remains running for the period the extension is activated. A long running server provides very good performance.

[Protocol buffers](https://developers.google.com/protocol-buffers) are used to define the gRPC service & messages. The Java & JavaScript message classes, as well as the client and server interfaces, are generated from the Protobuf files via the `protoc` compiler. TypeScript type definitions are generated from the JavaScript classes.

The Java server uses the [Gradle Tooling Api](https://docs.gradle.org/current/userguide/third_party_integration.html#embedding) to discover projects & tasks, and to run Gradle tasks.

## Discovering Projects & Tasks

Tasks belong to projects and projects are hierarchical, meaning projects can have sub-projects, and any/all projects in the tree can have tasks.

The gRPC server provides a `getBuild` method to provide this hierarchical data structure, and accepts a `projectDir` argument, which the client provides.

A root project (`projectDir`) is defined by having a gradle wrapper script at the root (`gradlew` or `gradlew.bat`).

Once the client has discovered the root projects for all workspaces, it requests project data for each project via separate gRPC method calls using `getBuild`. Gradle progress and output (`STDERR` & `STDOUT`) are streamed to the client. Once the tasks have been discovered and returned to the client, it builds a single-dimensional list of vscode tasks from the Gradle project tasks. These vscode tasks have definitions that contain all the relevant task & project information.

The extension models the project hierarchical structure using the vscode treeView. The treeview data provider consumes the vscode tasks, and builds a tree of projects & tasks using the information provided in the task definitions.

## Running Tasks

Gradle tasks can be run through either the [treeView](https://code.visualstudio.com/api/extension-guides/tree-view) or the Command Palette.

The tasks use the gRPC client to call the `runTask` server method. Similar to getting project data, Gradle progress and output (`STDERR` & `STDOUT`) is streamed to the client. Tasks are run in a custom vscode terminal.

## The Build System

Gradle is used as the build system for the extension, for both the client and the server. Gradle compiles the Java & Protobuf files and runs the relevant tasks to download & build all the dependencies of the project. The builds should work on Linux/MacOS & Windows.

Getting started on this extension is as simple as `./gradlew build`.