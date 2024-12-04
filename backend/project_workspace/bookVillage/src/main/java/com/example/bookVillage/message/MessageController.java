package com.example.bookVillage.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

	@Autowired
    private ChatService chatService;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@MessageMapping("/message")
    @Operation(summary = "메시지 전송", description = "메시지를 전송합니다.")
    public ResponseEntity<String> receiveMessage(@RequestBody ChatMessageDto messageDto) {
        // 메시지 저장
        ChatMessage chatMessage = chatService.saveMessage(messageDto);

        // 메시지를 해당 채팅방 구독자들에게 전송
        messagingTemplate.convertAndSend("/sub/chatroom/" + messageDto.getChatroomSeq(), messageDto);
        return ResponseEntity.ok("메시지 전송 완료");
}
