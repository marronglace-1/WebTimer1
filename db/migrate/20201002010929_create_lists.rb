class CreateLists < ActiveRecord::Migration[5.2]
  def change
    create_table :lists do |t|
      t.integer :user_id
      t.integer :list_id
      t.string :list_content

      t.timestamps
    end
  end
end
