# You can export a Copilot Chat session in Visual Studio Code
# to a JSON file via `Ctrl+Shift+P | Chat: Export Session...`
# or by choosing `View > Command Palette | Chat: Export Session...`

# Inspired by https://github.com/Marijn-Bergman/copilot-chat-export-formatter

import sys
import json


def parse(filename):
    with open(filename, 'r') as file:
        data = json.load(file)

    empty = True
    with open(f'{filename}.md', 'w') as file:
        for request in data.get('requests', []):
            if request.get('isCanceled'):
                continue

            if empty:
                title = request.get('followups', [])
                if title:
                    title = title[0].get('title')
                    if title:
                        file.write(f"# {title}\n\n")
                        empty = False

            message = request.get('message', {}).get('text')
            if not message:
                continue

            file.write(f"**{message}**\n\n")

            responses = request.get('response', [])
            for response in responses:
                response = response.get('value')
                if response:
                    file.write(f"{response}\n\n")

            file.write("-----------------------------------\n\n")


def get_filename():
    return sys.argv[1] if len(sys.argv) > 1 else "chat.json"


if __name__ == "__main__":
    parse(get_filename())
