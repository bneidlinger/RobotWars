#!/usr/bin/env python3
import os
import sys


def export_project_files(project_dir, output_file):
    """Export only the relevant project Python files to a markdown file."""

    # Define the exact files we want to include, in the desired order
    target_files = [
        "package.json",
        "client/css/main.css",
        "client/js/engine/arena.js",
        "client/js/engine/collision.js",
        "client/js/engine/audio.js"
        "client/js/engine/game.js",
        "client/js/engine/interpreter.js",
        "client/js/engine/robot.js",
        "client/js/ui/controls.js",
        "client/js/ui/dashboard.js",
        "client/js/ui/history.js",
        "client/js/ui/editor.js",
        "client/js/ui/lobby.js",
        "client/js/main.js",
        "client/js/network.js",
        "client/index.html",
        "server/game-instance.js",
        "server/game-manager.js",
        "server/index.js",
        "server/server-collision.js",
        "server/server-interpreter.js",
        "server/server-robot.js",
        "server/socket-handler.js",
        "server/dummy-bit-ai.js"
    ]

    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("# RobotWars App Code Export\n\n")

        for file_path in target_files:
            full_path = os.path.join(project_dir, file_path)

            # Check if the file exists
            if not os.path.exists(full_path):
                print(f"Warning: File not found: {file_path}")
                continue

            out.write(f"## {file_path}\n\n")
            out.write("```code\n")

            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    out.write(content)
                    # Ensure there's a newline at the end
                    if not content.endswith('\n'):
                        out.write('\n')
            except Exception as e:
                out.write(f"# Error reading file: {str(e)}\n")

            out.write("```\n\n")

        print(f"Successfully exported the specified Python files to {output_file}")


def main():
    # Get the directory where this script is executed
    project_dir = os.getcwd()

    # Output file path
    output_file = os.path.join(project_dir, "RobotWars_app_code.md")

    # Export only the relevant files
    export_project_files(project_dir, output_file)


if __name__ == "__main__":
    main()